const aws = require('aws-sdk');

exports.handler = async function(event) {
  console.log('SCRAPING THE PRODUCT');
  console.log("PAYLOAD: ", event);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: `SCRAPING THE PRODUCT LOOKING FOR PRICE ${event.Payload}`
  }
};
