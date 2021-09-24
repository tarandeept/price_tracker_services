const cheerio = require('cheerio');
const got = require('got');
const { build_response } = require("./utils");

const extract_price = (html) => {
  var price = html('span[id=priceblock_ourprice]').html();
  price = price.replace('$', '').replace(',', '').trim();
  price = parseFloat(price);
  return price;
}

const extract_title = (html) => {
  var title = html('span[id=productTitle]').html();
  return title.trim();
}

exports.handler = async function(event) {
  try {
    const product_url = event.product_url;
    const response = await got(product_url);

    const html = cheerio.load(response.body, null, false);
    const price = extract_price(html);
    const title = extract_title(html);

    return build_response(200, `Here is the price ${price} for ${title}`);
  } catch(error) {
    var body = error.stack || JSON.stringify(error, null, 2);
    console.log(body);
    return build_response(400, JSON.stringify(body));
  }
};
