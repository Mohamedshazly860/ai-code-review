# backend/config/settings/production.py

from .base import *  # noqa: F401, F403

DEBUG = False

# In production we'll add:
# - SECURE_SSL_REDIRECT
# - HSTS headers
# - Stricter ALLOWED_HOSTS
# We leave these for the deployment phase