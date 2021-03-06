const { DynamoDB } = require('aws-sdk');
const { build_response } = require("./utils");

exports.handler = async function(event) {
  try {
    console.log('EVENT: ', JSON.stringify(event));
    return build_response(200, 'Successfully unsubscribed customer to product');
  } catch(error) {
    console.log('Err: ', error);
    return build_response(400, error);
  }
};
