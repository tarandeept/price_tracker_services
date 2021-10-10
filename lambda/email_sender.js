const { DynamoDB } = require('aws-sdk');
const { build_response } = require("./utils");

exports.handler = async function(event) {
  try {
    console.log('SENDING EMAIL');
    const dynamo = new DynamoDB();
    return build_response(200, 'Success');
  } catch(error) {
    console.log('Err: ', error);
    return build_response(400, error);
  }
};
