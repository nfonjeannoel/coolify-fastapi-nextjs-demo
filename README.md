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
uvicorn main:app --reload --host 0.0.0.0 --port 8010
```

### Web
```bash
cd web
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` for web (e.g. `http://localhost:8010`).


## Coolify best-practice networking

For production-style setup, the web app calls its own Next.js API route (`/api/hello`) and that route calls the backend over the private Coolify network using `API_INTERNAL_URL` (default `http://demo-api:8010`).

- In **web** app env, set: `API_INTERNAL_URL=http://demo-api:8010`
- You no longer need `NEXT_PUBLIC_API_URL` for backend access.
