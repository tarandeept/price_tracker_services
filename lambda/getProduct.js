const {DynamoDB, Lambda} = require('aws-sdk');


exports.handler = async function(event) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Getting the current price of the product!, CDK! You've hit ${event.path}\n`
  };

  // Query DB
  // If product is there and price is present, return the product record

  // Else, crawl the page and extract the price
  // Persist price into table
  // Return the product record

  // Error handling
  // Throw 404 if invalid product_url or can't find price
};



// exports.handler = async function(event) {
//   console.log("request: ", JSON.stringify(event, undefined, 2));

//   // create AWS SDK clients
//   const dynamo = new DynamoDB();
//   const lambda = new Lambda();

//   // update dynamo entry for "path" with hits++
//   await dynamo.updateItem({
//     TableName: process.env.HITS_TABLE_NAME,
//     Key: { path: { S: event.path } },
//     UpdateExpression: 'ADD HITS :incr',
//     ExpressionAttributeValues: { ':incr': { N: '1' } }
//   }).promise();

//   // call downstream function and capture response
//   const resp = await lambda.invoke({
//     FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
//     Payload: JSON.stringify(event)
//   }).promise();

//   console.log('downstream response: ', JSON.stringify(resp, undefined, 2));

//   // return response back to upstream caller
//   return JSON.parse(resp.Payload);
// };
