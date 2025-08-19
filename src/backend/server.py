from fastapi import FastAPI
from pydantic import BaseModel
from bs4 import BeautifulSoup
from contextlib import asynccontextmanager
from pymongo import AsyncMongoClient
from urllib.parse import quote_plus

username = ""
password = quote_plus("")  



@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncMongoClient(uri)
    global db
    db = client['jobs']
    yield
    await client.close()

app = FastAPI(lifespan=lifespan)

class Job(BaseModel):
    name: str
    url: str
    html: str

@app.post("/jobs")
async def create_job(payload: Job):

    job_data = {} 

    # Parse Data
    match payload.name.lower():
        case "linkedin":
            job_data = linkedin_parser(payload.url)
        case "indeed":
            job_data = indeed_parser(payload.url)
        case "handshake":
            job_data = handshake_parser(payload.url)

    # Store Data

    return {payload.url: "Parsed"}



def linkedin_parser(url):
    return

def indeed_parser(url):
    return

def handshake_parser(url):
    return