from django.db import models
from storage.models import Tobacco

# Create your models here.

class Generator(models.Model):
    main = models.ForeignKey(Tobacco, on_delete=models.CASCADE, related_name='main_generator')
    secondary = models.ForeignKey(Tobacco, on_delete=models.CASCADE, related_name='secondary_generator')
    tint = models.ForeignKey(Tobacco, on_delete=models.CASCADE, related_name='tint_generator')


    def __str__(self) -> str:
        return f"{self.main} {self.secondary} {self.tint}"