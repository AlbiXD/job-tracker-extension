from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import pymongo

app = Flask(__name__)
CORS(app)
myclient =pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["job-tracker"]
mycol = mydb["example"]

@app.route("/api/track/linkedin", methods=['POST'])
def track():
    html_blob = request.data.decode("utf-8")
    soup = BeautifulSoup(html_blob, "html.parser")
    a = soup.find_all('a')



    doc = {
        "name":a[-2].text.strip(),
        "role":a[-5].text.strip()
        }
    mycol.insert_one(doc)
    return jsonify({"message": "HTML received"})

if __name__ == "__main__":
    app.run(debug=True)