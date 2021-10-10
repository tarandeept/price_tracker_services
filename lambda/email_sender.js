const { DynamoDB } = require('aws-sdk');
const { build_response } = require("./utils");

const send_product_emails = (product_url, price, title) => {
  // const dynamo = new DynamoDB();

  // Call main API to GET all users subscribed to the product
  // For each user:
  //    Send user an email
  //    Log that the email was sent in the emails DB
  //    PATCH update their target price to the new price
}

exports.handler = async function(event) {
  try {
    // console.log('EVENT:', JSON.stringify(event));

    event.Records.forEach(record => {
      const body = JSON.parse(record.body);
      const message = JSON.parse(body.Message);
      const product_url = message.product_url;
      const price = message.price;
      const title = message.title;

      send_product_emails(product_url, price, title);
    });

    return build_response(200, 'Success');
  } catch(error) {
    console.log('Err: ', error);
    return build_response(400, String(error));
  }
};
