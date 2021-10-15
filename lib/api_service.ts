import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as apigw from '@aws-cdk/aws-apigateway';
import { Duration } from '@aws-cdk/core';

export interface ApiServiceProps {}

export class ApiService extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ApiServiceProps) {
    super(scope, id);

    const subscriptionsTable = new dynamodb.Table(this, 'Subscriptions', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    });

    const subscribeHandler = new lambda.Function(this, 'SubscribeHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'subscribe.handler',
      timeout: Duration.seconds(20),
      environment: {
        TABLE_NAME: subscriptionsTable.tableName
      }
    });

    const unsubscribeHandler = new lambda.Function(this, 'UnsubscribeHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'unsubscribe.handler',
      timeout: Duration.seconds(20),
      environment: {
        TABLE_NAME: subscriptionsTable.tableName
      }
    });

    const getSubscribersHandler = new lambda.Function(this, 'GetSubscribers', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getSubscribers.handler',
      timeout: Duration.seconds(20),
      environment: {
        TABLE_NAME: subscriptionsTable.tableName
      }
    });

    // grant the lambda role read/write permissions to our table
    subscriptionsTable.grantReadWriteData(subscribeHandler);
    subscriptionsTable.grantReadWriteData(unsubscribeHandler);
    subscriptionsTable.grantReadWriteData(getSubscribersHandler);

    // Defines an API Gateway REST API resource backed by our Lambda handler
    const api = new apigw.LambdaRestApi(this, 'RestAPI', {
      handler: subscribeHandler,
      proxy: false
    });

    const subscribeIntegration = new apigw.LambdaIntegration(subscribeHandler);
    const unsubscribeIntegration = new apigw.LambdaIntegration(unsubscribeHandler);
    const getSubsIntegration = new apigw.LambdaIntegration(getSubscribersHandler);

    const subscribe = api.root.addResource('subscribe');
    const unsubscribe = api.root.addResource('unsubscribe');
    const getSubs = api.root.addResource('subscribers');

    subscribe.addMethod('POST', subscribeIntegration);  // POST /subscribe
    unsubscribe.addMethod('POST', unsubscribeIntegration);  // POST /unsubscribe
    getSubs.addMethod('GET', getSubsIntegration);  // GET /subscribers
  }
}
