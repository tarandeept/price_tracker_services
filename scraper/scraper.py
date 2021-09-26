import requests

if __name__ == '__main__':
    url = 'https://www.amazon.com/Wilson-WRT30400U3-Federer-Tennis-Racquet/dp/B01AWLHRSO/ref=sr_1_4?_encoding=UTF8&c=ts&dchild=1&keywords=Tennis%2BRackets&qid=1632527081&s=racquet-sports&sr=1-4&ts_id=3420071&th=1&psc=1'
    proxies = {
        "http": 'http://205.185.118.53:80'
    }

    headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
        'content-type': 'application/json',
        'accept': 'text/html, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9',
        'x-requested-with': 'XMLHttpRequest',
    }

    try:
        response = requests.get(url, headers=headers)
        print(response.text)
    except Exception as e:
        print(e)