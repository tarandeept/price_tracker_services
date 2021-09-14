import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as apigw from '@aws-cdk/aws-apigateway';

export interface ProductServiceProps {}

export class ProductService extends cdk.Construct {
  // Allows accessing the counter function
  public readonly handler: lambda.Function;

  // The hit counter table
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: ProductServiceProps) {
    super(scope, id);

    const productsTable = new dynamodb.Table(this, 'Products', {
      partitionKey: { name: 'product_url', type: dynamodb.AttributeType.STRING }
    });

    const handler = new lambda.Function(this, 'GetProductHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProduct.handler',
      environment: {
        TABLE_NAME: productsTable.tableName
      }
    });

    // grant the lambda role read/write permissions to our table
    productsTable.grantReadWriteData(handler);

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
