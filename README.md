# Welcome to your CDK TypeScript project!

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Dependencies

* @aws-cdk/aws-iam
* @aws-cdk/aws-dynamodb
* @aws-cdk/aws-dynamodb-global
* @aws-cdk/aws-apigateway
* @aws-cdk/aws-lambda
* @aws-cdk/aws-certificatemanager

## Bootstrap

* `cdk bootstrap`

## Synth

* `cdk synth icc-global-dynamo-stack-dev`
* `cdk synth icc-global-api-1-${STAGE}`
* `cdk synth icc-global-api-2-${STAGE}`

## Deploy Individual

* `cdk deploy icc-global-dynamo-stack-dev`
* `cdk deploy icc-global-api-1-${STAGE}`
* `cdk deploy icc-global-api-2-${STAGE}`

## Deploy All (Wildcard)

* `cdk deploy 'icc-*'`

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template