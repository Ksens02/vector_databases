from chromadb.utils import embedding_functions
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

embedder = embedding_functions.DefaultEmbeddingFunction()


app.mount("/", StaticFiles(directory="static", html=True), name="static")

