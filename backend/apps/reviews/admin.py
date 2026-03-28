# backend/apps/reviews/admin.py

from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'language', 'status', 'quality_score', 'created_at')
    list_filter = ('status', 'language')
    search_fields = ('user__username', 'code_snippet')
    readonly_fields = ('raw_response', 'created_at', 'updated_at')