#!/bin/bash

set -e

echo "⏳ Waiting for PostgreSQL..."
while ! curl -s "${POSTGRES_HOST}:${POSTGRES_PORT}" > /dev/null 2>&1; do
    sleep 1
done

echo "✅ PostgreSQL is ready"

echo "🔄 Running migrations..."
python manage.py migrate --noinput

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo "🚀 Starting server..."
exec "$@"
