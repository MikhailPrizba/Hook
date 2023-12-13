from django.db import models
from user.models import User
from core.models import (
    MainInformationMixin,
    ModelManagerMixin,
)  # Create your models here.


class OwnerManager(ModelManagerMixin):
    """Manager for the Supplier model."""

    def create_instance(self, **kwargs) -> models.Model:
        """
        Create a new instance of the Supplier model and associate it with the user.

        Args:
            **kwargs: Parameters for creating the instance.

        Returns:
            models.Model: Created instance.
        """
        user = User.objects.create_user(**kwargs.get("user"))

        kwargs["user"] = user

        instance = super().create_instance(**kwargs)
        return instance


class Owner(MainInformationMixin):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    objects = OwnerManager()

    def __str__(self) -> str:
        return self.user.username
