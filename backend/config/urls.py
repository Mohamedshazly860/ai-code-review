# backend/config/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.reviews.urls')),
]

# Why prefix everything with 'api/'?
# When Nginx routes traffic, it sends /api/* to Django and /* to React.
# This clean separation means Django never needs to know about the frontend routes.