const { DynamoDB } = require('aws-sdk');
const { build_response } = require("./utils");

exports.handler = async function(event) {
  try {
    console.log('EVENT: ', JSON.stringify(event));
    const product_url = event.queryStringParameters.product_url;
    const dynamo = new DynamoDB();

    // var params = {
    //   TableName: process.env.TABLE_NAME,
    //   KeyConditionExpression: 'product_url = :url',
    //   ExpressionAttributeValues: {
    //     ':url': { S: product_url }
    //   }
    // }

    // const data = await dynamo.query(params).promise();

    // if (data.Items.length === 1 && data.Items[0].price.N > 0) {
    //   return build_response(200, data.Items[0]);
    // }

    return build_response(200, 'Successfully got subs');
  } catch(error) {
    console.log('Err: ', error);
    return build_response(400, error);
  }
};
