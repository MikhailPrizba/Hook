from django.db import models
from user.models import User
from core.models import MainInformationMixin
# Create your models here.
class Organization(MainInformationMixin):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length = 255, unique=True)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length = 255)
    email = models.EmailField(max_length=254)
    
    def __str__(self):
        return self.name