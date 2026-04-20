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

@app.get("/cosine_similarity")
async def cosine_similarity(text1: str, text2: str):
    vector1 = embedder([text1])[0]
    vector2 = embedder([text2])[0]
    
    # Compute cosine similarity
    dot_product = np.dot(vector1, vector2)
    norm_vector1 = np.linalg.norm(vector1)
    norm_vector2 = np.linalg.norm(vector2)
    
    if norm_vector1 == 0 or norm_vector2 == 0:
        return {"cosine_similarity: 0.0"}
    
    cosine_sim = dot_product / (norm_vector1 * norm_vector2)
    
    return {"cosine_similarity": float(cosine_sim)}


app.mount("/", StaticFiles(directory="static", html=True), name="static")