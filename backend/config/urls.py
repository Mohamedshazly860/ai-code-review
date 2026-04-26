# backend/config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
import os


def health_check(request):
    return JsonResponse({'status': 'ok'})


def debug_settings(request):
    """Temporary — remove after debugging"""
    import django.conf
    settings = django.conf.settings
    return JsonResponse({
        'DJANGO_SETTINGS_MODULE': os.environ.get('DJANGO_SETTINGS_MODULE'),
        'DEBUG': settings.DEBUG,
        'ALLOWED_HOSTS': settings.ALLOWED_HOSTS,
        'CORS_ALLOWED_ORIGINS': getattr(settings, 'CORS_ALLOWED_ORIGINS', 'NOT SET'),
        'INSTALLED_APPS_HAS_CORS': 'corsheaders' in settings.INSTALLED_APPS,
        'MIDDLEWARE_HAS_CORS': any('CorsMiddleware' in m for m in settings.MIDDLEWARE),
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    path('api/debug/', debug_settings, name='debug-settings'),
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.reviews.urls')),
]