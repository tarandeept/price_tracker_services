const aws = require('aws-sdk');

exports.handler = async function(event) {
  console.log("EVENT: ", event);
  console.log("PRODUCT URL: ", event.product_url);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: `SCRAPING THE PRODUCT ${event.product_url}`
  }
};
