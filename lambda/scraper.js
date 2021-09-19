const cheerio = require('cheerio');
const got = require('got');
const { build_response } = require("./utils");

exports.handler = async function(event) {
  try {
    const product_url = event.product_url;
    const response = await got(product_url);

    const $ = cheerio.load(response.body, null, false);
    const price = $('span[id=priceblock_ourprice]').html();

    return build_response(200, `Here is the price ${price}`);

  } catch(error) {
    console.log(error);
  }

};
