FROM node:22-alpine AS frontend

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/backend

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./backend
COPY --from=frontend /app/dist ./dist

RUN DJANGO_DEBUG=false DJANGO_SECRET_KEY=build-only-secret python backend/manage.py collectstatic --noinput

CMD ["sh", "-c", "python backend/manage.py migrate --noinput && gunicorn config.wsgi:application --chdir backend --bind 0.0.0.0:${PORT:-10000}"]
