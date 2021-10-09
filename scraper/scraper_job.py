import os
import json
import boto3

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
        dynamodb = boto3.client('dynamodb')
        # TableName = os.environ.get('TABLE_NAME')
        TableName = 'PriceTrackerServicesStack-ProductServiceProductsD9CDFA32-NG2N623JDODP'

        records = dynamodb.scan(TableName=TableName)

        for rec in records['Items']:
            print(rec)
            print()



        return {
            'status_code': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': { 'products_scraper': 1 }
        }

    except Exception as e:
        return {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'errors': str(e)
        }

if __name__ == '__main__':
    handler('event')
