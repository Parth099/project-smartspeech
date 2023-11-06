from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# custom modules
from .routers.s3 import router as s3_router
from .routers.rekognition import router as rekognition_router
from .routers.tts import router as tts_router
from .routers.similarity import router as similarity_router

from dotenv import dotenv_values
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

class Drawing(BaseModel):
    content: str


class DrawingResponse(BaseModel):
    predictions: List[str]


class Image(BaseModel):
    content: str


class ImageResponse(BaseModel):
    predictions: List[str]


app = FastAPI()
app.include_router(s3_router)
app.include_router(tts_router)
app.include_router(rekognition_router)
app.include_router(similarity_router)

origins = [
    "http://localhost:3000",
    "http://localhost",
    "https://project-smartspeech.vercel.app"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health-check")
async def healthCheck():
    return {"message": "an apple a day keeps the doctor away"}
