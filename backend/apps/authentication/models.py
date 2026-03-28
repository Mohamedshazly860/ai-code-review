from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    """

    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return self.username


class Profile(models.Model):
    """
    Extended personal information for a User.

    Separated from User intentionally:
    - User is loaded on every authenticated request (keep it lean)
    - Profile is only loaded when personal info is actually needed

    All fields are optional — the profile is auto-created empty on
    registration. The user fills in details at their own pace.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    first_name = models.CharField(max_length=50, blank=True, default='')
    last_name = models.CharField(max_length=50, blank=True, default='')
    phone_number = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField(blank=True, default='')
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True
    )
    bio = models.TextField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'profiles'

    def __str__(self):
        return f"Profile of {self.user.username}"

    @property
    def full_name(self):
        """Convenience property — returns full name or username as fallback."""
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Fires every time a User is saved.
    `created` is True only on INSERT (first save), False on UPDATE.
    We only create the profile once — on first user creation.
    """
    if created:
        Profile.objects.create(user=instance)