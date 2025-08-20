from bs4 import BeautifulSoup




with open('test.html', 'r', encoding='utf-8') as file:
    html_content = file.read()


soup = BeautifulSoup(html_content, "html.parser")

job_name = soup.body.h1.text.strip() # Job Name
company = soup.body.find(class_="job-details-jobs-unified-top-card__company-name").a.text.strip() # Company Name
container = soup.body.find(
    class_="job-details-jobs-unified-top-card__primary-description-container"
)
location = container.find("span", class_="tvm__text tvm__text--low-emphasis").get_text(
    strip=True
)

