const { DynamoDB } = require('aws-sdk');
const { randomUUID } = require('crypto');
const { build_response } = require("./utils");


const is_subscribed = async (product_url, email) => {
  const dynamo = new DynamoDB();

  var params = {
    TableName: process.env.TABLE_NAME,
    IndexName: 'emailIndex',
    KeyConditionExpression: 'email = :email',
    FilterExpression: 'product_url = :product_url',
    ExpressionAttributeValues: {
      ':email': { S: email },
      ':product_url': { S: product_url }
    }
  }

  const data = await dynamo.query(params).promise();
  return data.Count >= 1;
}

const subscribe_user = async (product_url, email, target_price) => {
  const id = randomUUID();
}

exports.handler = async function(event) {
  try {
    // console.log('EVENT: ', JSON.stringify(event));

    const body = JSON.parse(event.body);
    const { product_url, email, target_price } = body;

    const subscribed = await is_subscribed(product_url, email);
    if (!subscribed) {
      await subscribe_user(product_url, email, target_price);
    }

    return build_response(200, 'Successfully subscribed user to product');
  } catch(error) {
    console.log('Err: ', error);
    return build_response(400, error);
  }
};
