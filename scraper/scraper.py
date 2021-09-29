import os
import json
import requests
from bs4 import BeautifulSoup
import boto3

def extract_title(soup):
    title = soup.find(id='productTitle').text
    return title.strip()

def extract_price(soup):
    price = soup.find(id='priceblock_ourprice').text
    price = price.replace('$', '').replace(',', '').strip()
    return float(price)

def handler(event, context=None):
    url = event['product_url']
    proxies = {
        "http": 'http://64.124.38.140:8080',
        "https": 'http://64.124.38.140:8080'
    }

    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
        'content-type': 'application/json',
        'accept': 'text/html, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9',
        'x-requested-with': 'XMLHttpRequest',
    }

    try:
        response = requests.get(url, headers=headers, proxies=proxies)
        soup = BeautifulSoup(response.text, 'html.parser')

        title = extract_title(soup)
        price = extract_price(soup)

        dynamodb = boto3.client('dynamodb')

        dynamodb.put_item(
            TableName=os.environ.get('TABLE_NAME'),
            Item={
                'product_url': { 'S': url },
                'title': { 'S': title },
                'price': { 'N': str(price) }
            }
        )

        return {
            'status_code': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': { 'product_url': url, 'title': title, 'price': price }
        }

    except Exception as e:
        return {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'errors': str(e)
        }

if __name__ == '__main__':
    url = 'https://www.amazon.com/Wilson-WRT30400U3-Federer-Tennis-Racquet/dp/B01AWLHRSO/ref=sr_1_4?_encoding=UTF8&c=ts&dchild=1&keywords=Tennis%2BRackets&qid=1632527081&s=racquet-sports&sr=1-4&ts_id=3420071&th=1&psc=1'
    event = { 'product_url': url }
    response = handler(event)
    print(response)
