# FocusGeek AWS setup

The `focusgeek` stack is already deployed in `ap-south-1` for this workspace, and `.env.local` contains its public outputs. The instructions below support rebuilding it or setting up another account. Live API and browser checks passed on September 18, 2026. Vercel hosting has not been deployed; the API currently permits `http://localhost:3000` as its frontend origin.

## Infrastructure included

`backend/template.yaml` creates an email-based Cognito user pool and public app client, an authenticated REST API, Python Lambda, on-demand DynamoDB table with point-in-time recovery, a private encrypted S3 bucket, and a CloudWatch log group with 14-day retention. Data ownership comes exclusively from verified Cognito `sub` claims. Study writes use a revision check to avoid overwriting another device's changes.

The template defaults to Mumbai (`ap-south-1` in the commands) and `apac.amazon.nova-lite-v1:0`. This inference profile can route inference to other APAC regions. Its permissions allow only Nova Lite foundation models and the configured inference profile. Change the model policy as well as the parameter if adopting another model. Bedrock availability and permissions must be checked in the deployment account.

Reference: [SAM Cognito authorizers](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-cognitoauthorizer.html), [SAM API resources](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html).

## Deploy

Requires AWS CLI credentials, AWS SAM CLI, and Python 3.13. Alternatively use Docker with `sam build --use-container` for the Python 3.13 Lambda runtime. Install these tools before proceeding. The SAM CLI creates the packaged Lambda artifact and a CloudFormation stack.

From the repository root:

```powershell
Set-Location backend
sam validate --lint
sam build
sam deploy --guided --region ap-south-1
```

Use stack name `focusgeek`. Set `FrontendOrigin` to `http://localhost:3000` for development; set it to the exact Vercel origin when hosting the frontend. Accept creation of the Lambda execution role (`CAPABILITY_IAM`). All API routes require Cognito authentication; CORS preflight is exempt. Deploying resources and using Bedrock may incur AWS charges.

For an existing stack, build and deploy again with the desired parameter overrides. Only one frontend origin is configured at a time.

## Connect the frontend

Read CloudFormation outputs:

```powershell
aws cloudformation describe-stacks --stack-name focusgeek --region ap-south-1 --query 'Stacks[0].Outputs'
```

Create/update `.env.local` using the output values:

```dotenv
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<UserPoolId>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<UserPoolClientId>
NEXT_PUBLIC_API_URL=<ApiUrl>
```

These are public resource identifiers, not AWS secrets. Never put AWS access keys in `NEXT_PUBLIC_*` values. Restart Next.js after changing the environment. In Vercel, set all three environment values before building/deploying.

## Live smoke check

1. Sign up using a real email and a password containing uppercase, lowercase, a number, and a symbol. Confirm the email code, then sign in.
2. Add DBMS with a future exam date and set daily hours. Generate an AI schedule; verify task durations stay within the remaining daily budget.
3. Click Save to cloud, reload, and verify the subjects/tasks remain.
4. Upload a text PDF or TXT note. Ask a question contained in that note; verify the answer refers to the supplied material. Save the workspace.
5. Generate a quiz from the subject or note, answer every question, submit, and check the explanation and Analytics history. Save to cloud.
6. Finish a focus session and verify recorded hours. Save, log out, and sign in again to verify persistence.
7. Sign in with a second account; verify the workspace is empty and cannot see the first account's records.
8. Open the same account in two tabs, save changes in each, and verify stale saves receive a conflict instead of overwriting data.

## Troubleshooting and operations

Cloud feature errors are shown in the app. Check the Lambda log group in CloudWatch for the AWS request ID and error. The backend does not deliberately log notes, prompts, passwords, or tokens. API Gateway throttles requests to 5/second with a burst limit of 10. This is a starting limit rather than a per-user AI quota; add cost controls and rate limits before a public launch.

The Lambda timeout is 28 seconds. Large quizzes can time out; try fewer questions and verify the model's regional access. Cloud saves exceeding 280 KB are rejected to stay below DynamoDB's item limit. Export current changes if a save fails before reloading.

Cloud workspace reads load the current server version. They do not automatically restore unsaved browser drafts. Use Save to cloud before navigating away from the application or reloading.

## Cleanup

Use `sam delete --stack-name focusgeek --region ap-south-1` to remove the stack when no longer needed. DynamoDB and S3 have retention policies and remain after stack deletion to preserve student data. Review and remove those retained resources explicitly when their contents are no longer needed. Removing a note from the workspace does not delete its S3 original.

