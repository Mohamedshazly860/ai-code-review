# backend/apps/authentication/apps.py

from django.apps import AppConfig

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'  # ← Full dotted path, not just 'authentication'
    label = 'authentication'  # ← App label must be unique across the project