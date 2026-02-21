import platform
import time
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Coolify FastAPI Demo", version="1.2.0")

START_TIME = time.time()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/hello")
def hello(name: str = "world") -> Dict[str, str]:
    return {"message": f"Hello, {name}!"}


@app.get("/system")
def system_info() -> dict:
    return {
        "status": "operational",
        "version": app.version,
        "uptime_seconds": int(time.time() - START_TIME),
        "python_version": platform.python_version(),
        "stack": ["FastAPI", "Next.js", "Docker", "Coolify", "GitHub Actions"],
    }
