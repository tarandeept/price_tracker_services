import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as apigw from '@aws-cdk/aws-apigateway';
import { Duration } from '@aws-cdk/core';

export interface ProductServiceProps {}

export class ProductService extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ProductServiceProps) {
    super(scope, id);

    const productsTable = new dynamodb.Table(this, 'Products', {
      partitionKey: { name: 'product_url', type: dynamodb.AttributeType.STRING }
    });

    const scraperHandler = new lambda.Function(this, 'ScraperHandler', {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.fromAsset('scraper/deployment-package.zip'),
      handler: 'scraper.handler',
      timeout: Duration.seconds(20),
    });

    const handler = new lambda.Function(this, 'GetProductHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProduct.handler',
      timeout: Duration.seconds(20),
      environment: {
        TABLE_NAME: productsTable.tableName,
        SCRAPER_HANDLER: scraperHandler.functionName
      }
    });

    // grant the lambda role read/write permissions to our table
    productsTable.grantReadWriteData(handler);

    // grant the handler permission to invoke the scraper lambda
    scraperHandler.grantInvoke(handler);

    // Defines an API Gateway REST API resource backed by our Lambda handler
    const api = new apigw.LambdaRestApi(this, 'RestAPI', {
      handler: handler,
      proxy: false
    });

    const products = api.root.addResource('products');
    const product = products.addResource('{product_url}');
    const getProductIntegration = new apigw.LambdaIntegration(handler);
    product.addMethod('GET', getProductIntegration);  // GET /products/{product_url}
  }
}
