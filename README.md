# Learning CI/CD with OpenClaw: FastAPI + Next.js on Coolify

This repo documents my hands-on learning journey setting up a full-stack app and production-style delivery flow with OpenClaw.

## What this project demonstrates

- **Backend:** FastAPI service (`api/`)
- **Frontend:** Next.js app (`web/`)
- **Deployment:** Coolify (Docker-based)
- **CD:** Deploy from GitHub to Coolify
- **CI:** GitHub Actions checks for API + Web
- **Best-practice networking:** frontend calls a server route, which calls backend over Coolify internal network

---

## Architecture (best-practice)

Browser -> Frontend domain -> Next.js server route (`/api/hello`) -> `API_INTERNAL_URL` -> Backend container

This avoids CORS/browser-to-private-network problems.

### Important env var (web app)

```env
API_INTERNAL_URL=http://backend-api:8010
```

### Coolify recommendation

Set backend **Network Alias** to `backend-api` so app renames do not break internal calls.

---

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

Open `http://localhost:3000` and test the button.

---

## CI checks (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

- **API checks (FastAPI)**
  - install deps
  - syntax check
  - smoke tests (`/health`, `/hello`)
- **Web checks (Next.js)**
  - install deps
  - build check

---

## Why this repo exists

Learning by doing:
- infra basics
- container networking
- secure service-to-service communication
- CI/CD foundations
- practical DevOps workflows using OpenClaw


## Current demo mode

- No runtime model API key required.
- Frontend design is static and responsive (100vw/100vh).
- Frontend interacts with backend using `/api/hello` -> `API_INTERNAL_URL`.
