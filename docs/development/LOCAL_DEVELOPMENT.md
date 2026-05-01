# Local Development

This repository now contains a minimal runnable scaffold:

- `backend/`: Django API scaffold
- `frontend/`: React + Vite scaffold
- `docker-compose.yml`: optional PostgreSQL and Redis for local development

## Expected Local Ports

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## One-Time Setup

1. Copy `.env.example` to `.env`.
2. Choose your local mode:

- simplest mode: keep `DATABASE_ENGINE=sqlite` in `.env` and skip Docker
- full stack mode: set `DATABASE_ENGINE=postgres` and start infrastructure

3. If you want the full stack mode, start infrastructure:

```powershell
docker compose up -d
```

4. Backend setup:

```powershell
cd backend
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e .
python manage.py migrate
python manage.py runserver
```

5. Frontend setup in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

## PyCharm Workflow

### Backend

1. Open the repository root in PyCharm.
2. Create a Python interpreter from `backend/.venv`.
3. Create a Python run configuration:
   - Script path: `backend/manage.py`
   - Parameters: `runserver`
   - Working directory: `backend`
   - Environment file or variables: load values from `.env`
4. Create another run configuration for migrations:
   - Script path: `backend/manage.py`
   - Parameters: `migrate`

Use Python `3.12` for the backend interpreter. The backend package metadata and approved architecture assume `3.12`.

### Frontend

The simplest setup is to run the frontend from PyCharm's terminal:

```powershell
cd frontend
npm install
npm run dev
```

If you prefer, add a Node.js run configuration for `npm run dev`.

## Health Checks

- Backend health: `http://localhost:8000/api/health/`
- Frontend dev app: `http://localhost:5173`

In local frontend development, Vite proxies `/api/*` to the Django backend on port `8000`. That avoids cross-origin issues while the frontend runs on port `5173`.

## No-Docker Mode

If Docker is not installed yet, use SQLite locally:

- leave `DATABASE_ENGINE=sqlite` in `.env`
- skip `docker compose up -d`
- run:

```powershell
python manage.py migrate
python manage.py runserver
```

This is enough for early backend and frontend scaffolding work. PostgreSQL and Redis can be introduced later when you start implementing database-specific or realtime behavior.

## Startup Scripts

From the repository root you can now use:

```powershell
.\infra\scripts\Start-System.ps1
```

That launches backend and frontend in separate PowerShell windows.

You can also run only one side:

```powershell
.\infra\scripts\Start-Backend.ps1
.\infra\scripts\Start-Frontend.ps1
```

Useful option:

```powershell
.\infra\scripts\Start-System.ps1 -SkipInstall
```

`-SkipInstall` skips dependency checks and is useful once the local environment is already prepared.

To stop the tracked dev windows started by `Start-System.ps1`:

```powershell
.\infra\scripts\Stop-System.ps1
```

Or stop only one side:

```powershell
.\infra\scripts\Stop-Backend.ps1
.\infra\scripts\Stop-Frontend.ps1
```

## Current Scope

This scaffold is intentionally minimal. It gives you a bootable project shape aligned with the planning documents, but it does not implement the backlog yet.
