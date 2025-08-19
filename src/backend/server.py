from fastapi import FastAPI
from pydantic import BaseModel
from bs4 import BeautifulSoup
from contextlib import asynccontextmanager

import requests
import pymongo


app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

class Job(BaseModel):
    name: str
    url: str
    html: str

@app.post("/jobs")
def create_job(payload: Job):

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
    response = requests.get("https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4285084575")
    soup = BeautifulSoup(response, "html.parser")
    return

def indeed_parser(url):
    return

def handshake_parser(url):
    return