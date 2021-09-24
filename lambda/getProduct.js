const { DynamoDB, Lambda } = require('aws-sdk');
const { build_response } = require("./utils");

exports.handler = async function(event) {
  try {
    const product_url = event.pathParameters.product_url;
    const dynamo = new DynamoDB();
    const lambda = new Lambda();

    var params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'product_url = :url',
      ExpressionAttributeValues: {
        ':url': { S: product_url }
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
      Payload: JSON.stringify({ 'product_url': product_url }),
      LogType: 'Tail'
    }).promise();

    // console.log(resp.LogResult);

    const response = JSON.parse(resp.Payload);

    if (response.Payload.statusCode >= 400) {
      throw new Error(response.Payload.body);
    }

    const { title, price } = response.Payload;

    // Persist into db
    var params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        "product_url": { S: product_url },
        "title": { S: title },
        "price": { N: price }
      }
    };

    console.log(params);

    // await dynamo.putItem({
    //   TableName: process.env.HITS_TABLE_NAME,
    //   Key: { path: { S: event.path } },
    //   UpdateExpression: 'ADD HITS :incr',
    //   ExpressionAttributeValues: { ':incr': { N: '1' } }
    // }).promise();

    return build_response(200, 'Yessir');
  } catch(error) {
    return build_response(400, error);
  }
};
