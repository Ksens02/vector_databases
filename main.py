from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
import numpy as np
from chromadb.utils import embedding_functions

app = FastAPI()





app.mount("/", StaticFiles(directory="static", html=True), name="static")