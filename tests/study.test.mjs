import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
const compiled = ts.transpileModule(fs.readFileSync("lib/study.ts", "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const moduleObject = { exports: {} };
vm.runInNewContext(compiled, {
  exports: moduleObject.exports,
  module: moduleObject,
  crypto: webcrypto,
  Date,
  Set,
  Math,
  Number,
});
const { emptyStudy, generatePlan, studyMetrics, isStudyData, localDate } =
  moduleObject.exports;
test("scheduler prioritizes urgent exams, excludes expired exams, and respects daily hours", () => {
  const data = {
    ...emptyStudy,
    dailyHours: 2,
    subjects: [
      { id: "later", name: "OS", examDate: "2026-10-20", priority: 1 },
      { id: "urgent", name: "DBMS", examDate: "2026-09-18", priority: 3 },
      { id: "expired", name: "DSA", examDate: "2026-09-01", priority: 3 },
    ],
  };
  const plan = generatePlan(data, "2026-09-17");
  assert.equal(plan[0].subjectId, "urgent");
  assert.equal(
    plan.reduce((sum, t) => sum + t.minutes, 0),
    120,
  );
  assert.ok(
    plan.every(
      (t) => t.subjectId !== "expired" && t.minutes <= 50 && !t.completed,
    ),
  );
  assert.equal(new Set(plan.map((t) => t.id)).size, plan.length);
});
test("empty workspace does not fabricate progress", () => {
  const m = studyMetrics(emptyStudy, "2026-09-17");
  assert.equal(m.readiness, 0);
  assert.equal(m.minutes, 0);
  assert.equal(m.streak, 0);
  assert.equal(generatePlan(emptyStudy).length, 0);
});
test("readiness combines actual quiz accuracy, completion, study goals and consistency", () => {
  const sessions = Array.from({ length: 7 }, (_, i) => ({
    id: String(i),
    subjectId: "dbms",
    minutes: 120,
    completedAt: `2026-09-${11 + i}T12:00:00`,
  }));
  const data = {
    ...emptyStudy,
    sessions,
    tasks: [
      {
        id: "task",
        subjectId: "dbms",
        title: "Study",
        date: "2026-09-17",
        minutes: 30,
        completed: true,
      },
    ],
    attempts: [
      {
        id: "quiz",
        subjectId: "dbms",
        correct: 5,
        total: 5,
        completedAt: "2026-09-17T12:00:00",
      },
    ],
  };
  const m = studyMetrics(data, "2026-09-17");
  assert.equal(m.readiness, 100);
  assert.equal(m.streak, 7);
  assert.equal(m.activeDays, 7);
  assert.equal(m.minutes, 840);
  assert.equal(
    studyMetrics({ ...data, attempts: [] }, "2026-09-17").readiness,
    65,
  );
});
test("corrupt browser storage is rejected", () => {
  assert.ok(isStudyData(emptyStudy));
  assert.equal(isStudyData(null), false);
  assert.equal(isStudyData({ ...emptyStudy, subjects: [null] }), false);
  assert.equal(isStudyData({ ...emptyStudy, dailyHours: 0 }), false);
  assert.equal(
    isStudyData({ ...emptyStudy, notes: [{ id: "x", name: "x", content: 5 }] }),
    false,
  );
});
test("dates use the user's local calendar", () => {
  assert.equal(localDate(new Date(2026, 8, 17, 23, 59)), "2026-09-17");
});

test("regeneration accounts for completed work within today's budget", () => {
  const data = {
    ...emptyStudy,
    dailyHours: 1,
    subjects: [
      { id: "dbms", name: "DBMS", examDate: "2026-09-18", priority: 2 },
    ],
    tasks: [
      {
        id: "done",
        subjectId: "dbms",
        title: "Study",
        date: "2026-09-17",
        minutes: 40,
        completed: true,
      },
    ],
  };
  assert.equal(
    generatePlan(data, "2026-09-17").reduce((sum, t) => sum + t.minutes, 0),
    20,
  );
});
