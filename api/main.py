import os
from typing import Any, Dict

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Coolify FastAPI Demo", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptIn(BaseModel):
    prompt: str


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/hello")
def hello(name: str = "world") -> Dict[str, str]:
    return {"message": f"Hello, {name}!"}


@app.post("/generate")
async def generate(payload: PromptIn) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-3.1-pro")

    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on backend")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    req_body = {
        "contents": [{"parts": [{"text": payload.prompt}]}],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 500,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, params={"key": api_key}, json=req_body)
            resp.raise_for_status()
            data = resp.json()

        text = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
        )

        return {"model": model, "text": text, "raw": data}
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {exc.response.text}") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(exc)}") from exc
