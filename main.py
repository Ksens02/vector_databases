from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
import numpy as np
from chromadb.utils import embedding_functions

app = FastAPI()

embedder = embedding_functions.DefaultEmbeddingFunction()

# To test endpoint: /embed?text=<add_text_here>
@app.get("/embed")
async def embed_text(text: str):
    vector = embedder([text])[0].tolist()
    return vector


app.mount("/", StaticFiles(directory="static", html=True), name="static")