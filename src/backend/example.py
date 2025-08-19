import requests
from bs4 import BeautifulSoup


response = requests.get("https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4285084575")
print(response.status_code)
print(response.text)


soup = BeautifulSoup(response.text, "html.parser")
