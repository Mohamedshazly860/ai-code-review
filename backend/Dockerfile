# ── Stage 1: base ──────────────────────────────────────────────────────────────
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies needed for psycopg2 and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ── Stage 2: development ────────────────────────────────────────────────────────
FROM base AS development

COPY requirements/base.txt requirements/development.txt ./requirements/
RUN pip install --no-cache-dir -r requirements/development.txt

COPY . .

# ── Stage 3: production ─────────────────────────────────────────────────────────
FROM base AS production

COPY requirements/base.txt requirements/production.txt ./requirements/
RUN pip install --no-cache-dir -r requirements/production.txt

COPY . .

# Write the start script directly in the Dockerfile
RUN printf '#!/bin/sh\nset -e\npython manage.py migrate --noinput\nexec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120\n' > /start.sh \
    && chmod +x /start.sh

RUN addgroup --system django && adduser --system --ingroup django django
USER django

EXPOSE 8000
CMD ["/bin/sh", "/start.sh"]

