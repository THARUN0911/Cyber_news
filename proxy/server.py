from flask import Flask, request, Response
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/proxy')
def proxy():
    url = request.args.get('url')
    if not url:
        return ('Missing url parameter', 400)
    try:
        r = requests.get(url, timeout=15)
        content_type = r.headers.get('Content-Type', 'text/html')
        return Response(r.content, status=r.status_code, content_type=content_type)
    except requests.RequestException as e:
        return (str(e), 502)


if __name__ == '__main__':
    import logging
    logging.basicConfig(level=logging.INFO)
    try:
        print('Starting proxy on http://0.0.0.0:5000')
        # bind to 0.0.0.0 to make it reachable from localhost and other interfaces
        app.run(host='0.0.0.0', port=5000)
    except Exception as e:
        print('Proxy failed to start:', e)
