import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
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
  }
}
