from django.db import models
from owner.models import Owner
from core.models import MainInformationMixin


# Create your models here.
class Organization(MainInformationMixin):
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    email = models.EmailField(max_length=254)

    def __str__(self):
        return self.name
