const cheerio = require('cheerio');
const gotScraping = require('got-scraping');
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
    // const product_url = event.product_url;
    const product_url = 'https://www.amazon.com/Jura-Tumbler-Double-Stainless-Installation/dp/B07MJR3P1H/ref=sr_1_5?dchild=1&keywords=coffee+cup&qid=1632639304&sr=8-5';

    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
      'content-type': 'application/json',
      'accept': 'text/html, */*; q=0.01',
      'accept-language': 'en-US,en;q=0.9',
      'x-requested-with': 'XMLHttpRequest',
    }

    const response = await gotScraping({
      url: product_url,
      headers: headers
    });

    console.log(response.body);

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

const main = async () => {
  await exports.handler('event');
}

main()
