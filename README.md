# Hrithik Uday Portfolio

React portfolio UI built with Vite. Contact form messages are accepted by the
Django backend and saved to SQLite locally or PostgreSQL on Render.

## Run locally

From the project root, install the Python dependency and initialize the
database. In each PowerShell terminal used for Django, set the local
development environment first:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
$env:DJANGO_DEBUG = "true"
$env:DJANGO_SECRET_KEY = "local-only-development-key"
.\.venv\Scripts\python.exe backend\manage.py migrate
```

In one terminal, start Django:

```powershell
$env:DJANGO_DEBUG = "true"
$env:DJANGO_SECRET_KEY = "local-only-development-key"
.\.venv\Scripts\python.exe backend\manage.py runserver
```

In a second terminal, start the React app:

```powershell
npm install
npm run dev
```

The Vite development server proxies `/api/`, `/admin/`, and Django's `/static/`
assets to `http://127.0.0.1:8000`.

## View received messages

Create an admin account and sign in at `http://127.0.0.1:8000/admin/`:

```powershell
$env:DJANGO_DEBUG = "true"
$env:DJANGO_SECRET_KEY = "local-only-development-key"
.\.venv\Scripts\python.exe backend\manage.py createsuperuser
```

Messages are stored in the local SQLite database. Email notifications are not
configured. The admin dashboard and message screens use the portfolio's
dark-and-lime theme.

## Check the admin through the ngrok tunnel

Start Django with the current tunnel hostname allowed. In the Django terminal:

```powershell
$env:DJANGO_DEBUG = "true"
$env:DJANGO_SECRET_KEY = "local-only-development-key"
$env:DJANGO_ALLOWED_HOSTS = "localhost,127.0.0.1,probe-mule-mold.ngrok-free.dev"
$env:CSRF_TRUSTED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173,https://probe-mule-mold.ngrok-free.dev"
.\.venv\Scripts\python.exe backend\manage.py runserver
```

In another terminal, start the frontend and tunnel:

```powershell
npm run dev
ngrok http 5173
```

Open `https://probe-mule-mold.ngrok-free.dev/admin/` and sign in with the
superuser account. If ngrok gives you a different hostname, update
`vite.config.js` (`server.allowedHosts`) and the `DJANGO_ALLOWED_HOSTS` and
`CSRF_TRUSTED_ORIGINS` values above. This exposes the development admin to
anyone who can reach the tunnel; use a strong password and stop the tunnel
when finished.

## Production configuration

Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, and `DJANGO_ALLOWED_HOSTS` in the
deployment environment. Set `CSRF_TRUSTED_ORIGINS` to the exact HTTPS origins
serving the frontend. Route `/api/` and `/admin/` to Django, and serve the Vite
build from the same origin (or configure an equivalent reverse proxy).

## Deploy manually on Render

This project includes a `Dockerfile` that builds the React app and serves it
from Django, so the portfolio, contact API, and admin panel share one origin.
The deployment uses PostgreSQL for contact messages.

1. Push this project folder to a GitHub repository.
2. In Render, create a PostgreSQL database in the Singapore region. The free
   database is for testing and may expire; choose durable storage if you need
   to keep contact messages long term.
3. Create a **Web Service** from that repository. If this folder is the
   repository root, leave Root Directory blank; if it is nested inside the
   repository, set Root Directory to `react-portfolio`. Choose **Docker** as
   the runtime and select the free instance for testing.
4. In the web service's environment settings, add:
   - `DJANGO_DEBUG` = `false`
   - `DJANGO_SECRET_KEY` = generate a secret value in Render
   - `DATABASE_URL` = the database's **Internal Database URL**
5. Deploy. The container runs database migrations on startup and serves the
   portfolio at `/`, the contact API at `/api/contact/`, and Django Admin at
   `/admin/`.
6. In the Render service Shell, run
   `python backend/manage.py createsuperuser` to create the admin login.

The service automatically trusts its Render hostname for Django host and CSRF
checks. If you add a custom domain, add it to `DJANGO_ALLOWED_HOSTS` and add
its full HTTPS origin to `CSRF_TRUSTED_ORIGINS`.

## Verify

```powershell
.\.venv\Scripts\python.exe backend\manage.py test contact
npm run lint
npm run build
```

The React UI is in `src/App.jsx`; page metadata and font preload are in
`index.html`.
