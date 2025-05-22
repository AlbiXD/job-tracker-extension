from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route("/api/track", methods=['POST'])
def track():
    data = request.get_json()
    html_blob = data.get("html")
    soup = BeautifulSoup(html_blob, "html.parser")
    a = soup.find_all('a')

    for tag in a:
        print(tag.text.strip())

    return jsonify({"message": "HTML received"})

if __name__ == "__main__":
    app.run(debug=True)