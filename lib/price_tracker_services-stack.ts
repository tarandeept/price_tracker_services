import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class PriceTrackerServicesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Defines an AWS Lambda Resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });

    const helloWithCounter = new HitCounter(this , 'HelloHitCounter', {
      downstream: hello
    });

    const getPrice = new lambda.Function(this, 'getPriceHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getPrice.handler'
    });

    // Defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, 'RestAPI', {
      handler: helloWithCounter.handler
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-HITS'
    });

    const queue = new sqs.Queue(this, 'PriceTrackerServicesQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    // const topic = new sns.Topic(this, 'PriceTrackerServicesTopic');

    // topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
