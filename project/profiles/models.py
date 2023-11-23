from django.db import models
from user.models import User
from hookah.models import Organization
from core.models import MainInformationMixin
# Create your models here.
class Profiles(MainInformationMixin):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return self.user.username