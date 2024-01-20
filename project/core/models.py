from django.db import models


# Create your models here.
class MainInformationMixin(models.Model):
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    

    class Meta:
        abstract = True



class ModelManagerMixin(models.Manager):
    """
    A mixin for managing generic models.

    Attributes:
    - None

    Methods:
    - create_instance(**kwargs) -> models.Model:
        Creates a new instance with the given keyword arguments.
        Returns the created instance.

    - update_instance(id: int, **kwargs) -> models.Model:
        Updates the instance with the specified ID using the provided keyword arguments.
        Returns the updated instance.

    - soft_delete(instance: models.Model):
        Soft deletes the given instance by setting 'is_active' to False.
    """

    def create_instance(self, **kwargs) -> models.Model:
        """
        Create a new instance with the given keyword arguments.

        Args:
        - kwargs: Additional keyword arguments.

        Returns:
        - models.Model: The created instance.
        """
        return self.create(**kwargs)

    def update_instance(self, id: int, **kwargs) -> models.Model:
        """
        Update the instance with the specified ID using the provided keyword arguments.

        Args:
        - id: The ID of the instance to be updated.
        - kwargs: Keyword arguments for updating the instance.

        Returns:
        - models.Model: The updated instance.
        """
        self.filter(id=id).update(**kwargs)
        return self.get(id=id)
