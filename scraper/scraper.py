import os
import json
import requests
from bs4 import BeautifulSoup
import boto3
from dotenv import load_dotenv


def handler(event, context=None):
    try:
        url = event['product_url']
        html = get_html(url)
        soup = BeautifulSoup(html.text, 'html.parser')

        title = extract_title(soup)
        price = extract_price(soup)
        update_or_insert(url, title, price)

        return {
            'status_code': 200,
            'headers': { 'Content-Type': 'application/json' },
            'body': { 'product_url': url, 'title': title, 'price': price }
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 400,
            'headers': { 'Content-Type': 'application/json' },
            'errors': 'Error occured in handler'
        }

def get_html(url):
    proxy = get_random_proxy()
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
        'content-type': 'application/json',
        'accept': 'text/html, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9',
        'x-requested-with': 'XMLHttpRequest',
    }
    response = requests.get(url, headers=headers, proxies=proxy)
    return response

def get_random_proxy() -> {}:
    return {
        "http": 'http://64.124.38.140:8080',
        "https": 'http://64.124.38.140:8080'
    }

def extract_title(soup):
    title = soup.find(id='productTitle').text
    return title.strip()

def extract_price(soup):
    price = soup.find(id='priceblock_ourprice').text
    price = price.replace('$', '').replace(',', '').strip()
    return float(price)

def update_or_insert(url, title, new_price):
    record = query_for_product(url)

    if int(record['Count']) == 1:
        curr_price = float(record['Items'][0]['price']['N'])
        if new_price < curr_price:
            update_record(url, new_price)
            publish_to_sns(url, title, new_price)
        elif new_price > curr_price:
            update_record(url, new_price)
    else:
        insert_record(url, title, new_price)

def query_for_product(url):
    TableName = os.environ.get('TABLE_NAME')
    dynamodb = boto3.client('dynamodb')

    return dynamodb.query(
        TableName=TableName,
        KeyConditionExpression='product_url = :url',
        ExpressionAttributeValues={
            ':url': { 'S': url }
        }
    )

def update_record(url, new_price):
    TableName = os.environ.get('TABLE_NAME')
    dynamodb = boto3.client('dynamodb')

    dynamodb.update_item(
        TableName=TableName,
        Key={ 'product_url': { 'S': url } },
        UpdateExpression='set price=:price',
        ExpressionAttributeValues={
            ':price': { 'N': str(new_price) }
        }
    )

def insert_record(url, title, new_price):
    TableName = os.environ.get('TABLE_NAME')
    dynamodb = boto3.client('dynamodb')

    dynamodb.put_item(
        TableName=TableName,
        Item={
            'product_url': { 'S': url },
            'title': { 'S': title },
            'price': { 'N': str(new_price) }
        }
    )

def publish_to_sns(url, title, new_price):
    TopicArn = os.environ['TOPIC_ARN']
    sns = boto3.client('sns')

    sns.publish(
        TopicArn=TopicArn,
        Message=json.dumps({ 'product_url': url, 'price': new_price, 'title': title })
    )

def debug():
    TopicArn = os.environ['TOPIC_ARN']
    sns = boto3.client('sns', region_name = 'us-west-1')
    message_id = sns.publish(
        TopicArn=TopicArn,
        Message=json.dumps({'price': '12.99', 'title': 'tennis ball'})
    )

    QueueUrl = os.environ['QUEUE_URL']
    sqs = boto3.client('sqs', region_name = 'us-west-1')

    messages = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=10
    )
    body = json.loads(messages['Messages'][0]['Body'])
    print(body['Message'])

if __name__ == '__main__':
    # debug()
    load_dotenv()
    os.environ['TABLE_NAME'] = os.getenv('TABLE_NAME')
    os.environ['TOPIC_ARN'] = os.getenv('TOPIC_ARN')
    os.environ['QUEUE_URL'] = os.getenv('QUEUE_URL')

    url = 'https://www.amazon.com/Wilson-WRT30400U3-Federer-Tennis-Racquet/dp/B01AWLHRSO/ref=sr_1_4?_encoding=UTF8&c=ts&dchild=1&keywords=Tennis%2BRackets&qid=1632527081&s=racquet-sports&sr=1-4&ts_id=3420071&th=1&psc=1'
    event = { 'product_url': url }
    response = handler(event)
    print(response)
