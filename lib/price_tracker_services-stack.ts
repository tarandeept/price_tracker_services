import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { ProductService } from './product_service';
import { EmailService } from './email_service';

export class PriceTrackerServicesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productService = new ProductService(this, 'ProductService', {});

    const emailService = new EmailService(this, 'EmailService', {
      topic: productService.topic,
    });
  }
}
