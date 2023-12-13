from django.db import models
from user.models import User
from hookah.models import Organization
from core.models import MainInformationMixin, ModelManagerMixin

# Create your models here.


class WorkerManager(ModelManagerMixin):
    """Manager for the Supplier model."""

    def create_instance(self, **kwargs) -> models.Model:
        """
        Create a new instance of the Supplier model and associate it with the user.

        Args:
            **kwargs: Parameters for creating the instance.

        Returns:
            models.Model: Created instance.
        """
        print(kwargs)
        user = User.objects.create_user(**kwargs.get("user"))

        kwargs["user"] = user
        kwargs["organization"] = Organization.objects.get(id=kwargs.get("organization"))

        instance = super().create_instance(**kwargs)
        return instance


class Worker(MainInformationMixin):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    objects = WorkerManager()

    def __str__(self) -> str:
        return self.user.username
