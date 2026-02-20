# Coolify FastAPI + Next.js Demo

A minimal full-stack demo for Coolify:
- `api/` — FastAPI service
- `web/` — Next.js single-page frontend

## Local run (optional)

### API
```bash
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Web
```bash
cd web
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` for web (e.g. `http://localhost:8000`).
