from fastapi import FastAPI
from pydantic import BaseModel
from bs4 import BeautifulSoup
from contextlib import asynccontextmanager
from pymongo import AsyncMongoClient
from urllib.parse import quote_plus
from fastapi.middleware.cors import CORSMiddleware

username = "Cluster95580"
password = quote_plus("erion010")  

uri = f"mongodb+srv://{username}:{password}@cluster95580.jrijbax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster95580"


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncMongoClient(uri)
    global db
    db = client['jobs']
    yield
    await client.close()

app = FastAPI(lifespan=lifespan)
EXT_ID = "mllgnkkjaoneilfbljceabimcolalkod"  # your real ID
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        f"chrome-extension://{EXT_ID}",
        "https://www.linkedin.com",
        "https://www.linkedin.com/",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)

class Payload(BaseModel):
    id: str
    name: str
    url: str
    html: str
    
class Job(BaseModel):
    id: str
    job_name: str
    company_name: str
    location: str
    
@app.post("/jobs")
async def upsert_job(payload: Payload):
    col = db["jobs"]
    #Check if data already exists if so tell the user
    result = await col.find_one({"id": payload.id}, {"_id": 0})
    if result is not None:
        return {"Exists":True, "Result":result}
    
    #If not then the user's info will be parsed and sent back
    job_data = {} 
    # Parse Data
    match payload.name.lower():
        case "linkedin":
            job_data = linkedin_parser(payload.html, payload.id)
        case _:
            return {"404":"Invalid URL"}
    return {"Exists":False, "Result":job_data}

@app.post("/jobs/create")
async def create_job(job: Job):
    #TO BE IMPLEMENTED
    col = db["jobs"]
    result = await col.insert_one(job.model_dump())
    print(job, "has been stored")
    return job

def linkedin_parser(html, id):
    soup = BeautifulSoup(html, "html.parser")
    h1 = soup.body.find("h1") if soup.body else None
    job_name = h1.get_text(strip=True) if h1 else None

    #Company Name Check
    company = soup.body.find(class_="job-details-jobs-unified-top-card__company-name")
    company = company.a.get_text(strip=True) if (company and company.a) else None
    
    #Location Check
    container = soup.body.find(class_="job-details-jobs-unified-top-card__primary-description-container")
    location = None
    if container:
        loc_span = container.find("span", class_="tvm__text tvm__text--low-emphasis")
        location = loc_span.get_text(strip=True) if loc_span else None
    return {"id": id, "job_name": job_name, "company_name": company, "location": location}
