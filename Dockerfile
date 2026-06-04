FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings.production

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements/base.txt requirements/base.txt
COPY backend/requirements/production.txt requirements/production.txt
RUN pip install --no-cache-dir -r requirements/production.txt

COPY backend/ .

RUN printf '#!/bin/sh\nset -e\npython manage.py migrate --noinput\npython manage.py collectstatic --noinput\nexec gunicorn config.wsgi:application --bind 0.0.0.0:7860 --workers 2 --timeout 120\n' > /start.sh \
    && chmod +x /start.sh

EXPOSE 7860

CMD ["/bin/sh", "/start.sh"]