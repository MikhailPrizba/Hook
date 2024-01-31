from django.contrib.auth.models import AbstractUser
from django.db import models
from django_enum import TextChoices


# Create your models here.


class User(AbstractUser):
    class UserRoleChoices(TextChoices):
        UNKNOWN = "UNKNOWN"
        OWNER = "OWNER"
        ADMIN = "ADMIN"
        HOOKAH = "HOOKAH"
    user_role = models.TextField(
        choices=UserRoleChoices.choices, default=UserRoleChoices.OWNER
    )

    def __str__(self):
        return self.username
