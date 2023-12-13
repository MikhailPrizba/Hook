from django.db import models
from hookah.models import Organization
from core.models import MainInformationMixin
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.


class Tobacco(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    brand = models.CharField(max_length=255)
    supplier = models.CharField(max_length=255)
    taste = models.CharField(max_length=255)
    taste_group = models.CharField(max_length=255)
    best_before_date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(
        default=0, max_digits=12, decimal_places=2, validators=[MinValueValidator(0.00)]
    )
    count = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.brand} {self.taste}"
