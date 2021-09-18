const {DynamoDB, Lambda} = require('aws-sdk');

const build_response = (status, body) => {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: body
  }
}

exports.handler = async function(event) {
  // console.log("request:", JSON.stringify(event, undefined, 2));
  // console.log("EVENT PATH: ", event.pathParameters);
  const product_url = event.pathParameters.product_url;
  const dynamo = new DynamoDB();
  const lambda = new Lambda();

  // Query DB
  var params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'product_url = :url',
    ExpressionAttributeValues: {
      ':url': {S: product_url}
    }
  }

  const data = await dynamo.query(params).promise();

  // If product is there and price is present, return the product record
  if (data.Items.length === 1 && data.Items[0].price.N > 0) {
    return build_response(200, data);
  }

  // Else Invoke Lambda to scrape product_url
  const resp = await lambda.invoke({
    FunctionName: process.env.SCRAPER_HANDLER,
    Payload: JSON.stringify({'product_url': product_url}),
    LogType: 'Tail'
  }).promise();

  console.log(resp.LogResult);

  // return response
  return JSON.parse(resp.Payload);

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
