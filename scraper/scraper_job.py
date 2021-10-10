import os
import json
import boto3
from dotenv import load_dotenv

def handler(event, context=None):
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
        products = get_products()

        for product in products:
            url = product['product_url']['S']
            invoke_scraper_async(url)

        return {
            'status_code': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': { 'products_scraped': len(products) }
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'errors': 'Error occured in scraper job'
        }

def get_products():
    dynamodb = boto3.client('dynamodb')
    TableName = os.environ.get('TABLE_NAME')
    return dynamodb.scan(TableName=TableName)['Items']

def invoke_scraper_async(product_url):
    _lambda = boto3.client('lambda')

    _lambda.invoke(
        FunctionName=os.environ['SCRAPER_HANDLER'],
        InvocationType='Event',
        Payload=json.dumps({ 'product_url': product_url }),
    )

if __name__ == '__main__':
    load_dotenv()
    os.environ['TABLE_NAME'] = os.getenv('TABLE_NAME')
    os.environ['SCRAPER_HANDLER'] = os.getenv('SCRAPER_HANDLER')
    handler('event')
