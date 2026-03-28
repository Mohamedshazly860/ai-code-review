# backend/config/settings/development.py

from .base import *  # noqa: F401, F403

DEBUG = True
ALLOWED_HOSTS = ['*']

# In development, show full error details
# In production, this would be False