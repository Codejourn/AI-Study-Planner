import copy
import json
import os
import unittest
from unittest.mock import MagicMock, patch
from botocore.exceptions import ClientError
import handler

class BackendTests(unittest.TestCase):
    def setUp(self):
        self.environment = patch.dict(os.environ, {"TABLE_NAME": "study", "NOTES_BUCKET": "notes", "BEDROCK_MODEL_ID": "test-model"})
        self.environment.start()
        self.addCleanup(self.environment.stop)

    def event(self, path, method="POST", body=None, user="student-a"):
        return {"requestContext": {"authorizer": {"claims": {"sub": user}}}, "pathParameters": {"proxy": path}, "httpMethod": method, "body": json.dumps(body or {})}

    def test_rejects_unauthenticated_requests(self):
        result = handler.handle({"httpMethod": "GET"}, None)
        self.assertEqual(result["statusCode"], 401)

    def test_state_is_partitioned_by_verified_cognito_sub(self):
        table = MagicMock()
        table.get_item.return_value = {}
        with patch("handler.boto3.resource") as resource:
            resource.return_value.Table.return_value = table
            result = handler.handle(self.event("study", "GET", {"userId": "attacker"}), None)
        self.assertEqual(result["statusCode"], 200)
        table.get_item.assert_called_once_with(Key={"userId": "student-a"}, ConsistentRead=True)

    def test_conflicting_writes_do_not_overwrite_other_devices(self):
        table = MagicMock()
        table.put_item.side_effect = ClientError({"Error": {"Code": "ConditionalCheckFailedException"}}, "PutItem")
        with patch("handler.boto3.resource") as resource:
            resource.return_value.Table.return_value = table
            result = handler.handle(self.event("study", "PUT", {"data": handler.EMPTY, "revision": 3}), None)
        self.assertEqual(result["statusCode"], 409)
        args = table.put_item.call_args.kwargs
        self.assertEqual(args["ConditionExpression"], "revision = :revision")
        self.assertEqual(args["Item"]["userId"], "student-a")

    def test_invalid_storage_is_rejected(self):
        data = copy.deepcopy(handler.EMPTY)
        data["dailyHours"] = 0
        with self.assertRaises(ValueError):
            handler.validate_state(data)
        data["dailyHours"] = 2
        data["notes"] = [{"id": "note", "name": "notes.txt", "content": "x" * 200001}]
        with self.assertRaises(ValueError):
            handler.validate_state(data)

    def test_ai_schedule_cannot_exceed_daily_budget(self):
        data = copy.deepcopy(handler.EMPTY)
        data["dailyHours"] = .5
        data["subjects"] = [{"id": "dbms", "name": "DBMS", "examDate": "2026-09-18", "priority": 3}]
        with patch("handler.converse", return_value={"tasks": [{"subjectId": "dbms", "title": "Study", "minutes": 50}]}):
            result = handler.handle(self.event("planner/generate", body={"data": data, "today": "2026-09-17"}), None)
        self.assertEqual(result["statusCode"], 502)

    def test_invalid_ai_quiz_answers_are_rejected(self):
        question = {"question": "Q", "options": ["A", "B", "C", "D"], "answer": 9, "explanation": "Invalid"}
        with patch("handler.converse", return_value={"questions": [question]}):
            result = handler.handle(self.event("quiz/generate", body={"subject": "DBMS", "count": 1}), None)
        self.assertEqual(result["statusCode"], 502)

    def test_notes_upload_stores_original_under_owner_prefix(self):
        import base64
        s3 = MagicMock()
        with patch("handler.boto3.client", return_value=s3):
            result = handler.handle(self.event("notes/upload", body={"name": "notes.txt", "file": base64.b64encode(b"Normalization removes redundancy.").decode()}), None)
        self.assertEqual(result["statusCode"], 200)
        self.assertTrue(s3.put_object.call_args.kwargs["Key"].startswith("student-a/"))

    def test_pdf_upload_extracts_text_before_saving(self):
        import base64
        import io
        from pypdf import PdfWriter
        from pypdf.generic import DictionaryObject, NameObject, DecodedStreamObject
        writer = PdfWriter()
        page = writer.add_blank_page(width=300, height=300)
        font = DictionaryObject({NameObject("/Type"): NameObject("/Font"), NameObject("/Subtype"): NameObject("/Type1"), NameObject("/BaseFont"): NameObject("/Helvetica")})
        page[NameObject("/Resources")] = DictionaryObject({NameObject("/Font"): DictionaryObject({NameObject("/F1"): writer._add_object(font)})})
        stream = DecodedStreamObject()
        stream.set_data(b"BT /F1 12 Tf 30 100 Td (Second normal form removes partial dependencies.) Tj ET")
        page[NameObject("/Contents")] = writer._add_object(stream)
        output = io.BytesIO()
        writer.write(output)
        with patch("handler.boto3.client", return_value=MagicMock()):
            result = handler.handle(self.event("notes/upload", body={"name": "dbms.pdf", "file": base64.b64encode(output.getvalue()).decode()}), None)
        self.assertEqual(result["statusCode"], 200)
        self.assertIn("partial dependencies", json.loads(result["body"])["content"])

if __name__ == "__main__":
    unittest.main()
