# Welcome to your CDK TypeScript project!

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`PriceTrackerServicesStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## How to debug lambdas locally

Running local test using SAM CLI
Invoking a lambda
sam-beta-cdk local invoke -e ./sam/event.json -n ./sam/env.json PriceTrackerServicesStack/GetProductHandler

Starting an api gateway local server
sam-beta-cdk local start-api -n ./sam/env.json

Invoking the scraper lambda
sam-beta-cdk local invoke -e ./sam/happy_path.json -n ./sam/env.json PriceTrackerServicesStack/ScraperHandler

## Build scripts
Building the scraper lambda package
cd scraper
sh build.sh


## Edge cases to consider

- Invalid URL
- priceblock_ourprice id is not in the html of the URL
