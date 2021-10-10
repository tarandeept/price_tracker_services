import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Duration } from '@aws-cdk/core';

export interface EmailServiceProps {
  topic: sns.Topic;
}

export class EmailService extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: EmailServiceProps) {
    super(scope, id);

    const queue = new sqs.Queue(this, 'EmailServiceQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    props.topic.addSubscription(new subs.SqsSubscription(queue));

    const emailLambda = new lambda.Function(this, 'EmailHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'email_sender.handler',
      timeout: Duration.seconds(20),
    });

    // Invokes email lambda whenever SQS queue gets a new message
    emailLambda.addEventSource(new SqsEventSource(queue, {
      batchSize: 1,
      maxBatchingWindow: Duration.minutes(5),
    }));
  }
}
