const { DynamoDB } = require('aws-sdk');
const { randomUUID } = require('crypto');
const { build_response } = require("./utils");

const subscribe_user = (product_url, email, target_price) => {
  const dynamo = new DynamoDB();
  const id = randomUUID();

  var params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'product_url = :url',
    ExpressionAttributeValues: {
      ':url': { S: product_url }
    }
  }

  const data = await dynamo.query(params).promise();
}

exports.handler = async function(event) {
  try {
    console.log('EVENT: ', JSON.stringify(event));

    const body = JSON.parse(event.body);
    const { product_url, email, target_price } = body;

    subscribe_user(product_url, email, target_price);

    return build_response(200, 'Successfully subscribed user to product');
  } catch(error) {
    console.log('Err: ', error);
    return build_response(400, error);
  }
};
