const cheerio = require('cheerio');

exports.handler = async function(event) {
  console.log("EVENT: ", event);
  console.log("PRODUCT URL: ", event.product_url);

  const $ = cheerio.load('<ul id="fruits">...</ul>', null, false);
  console.log($.html());

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: `SCRAPING THE PRODUCT ${event.product_url}`
  }
};
