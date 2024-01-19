from django.db import models
class Generator(models.Model):
    main = models.CharField(max_length=30)
    second = models.CharField(max_length=30)
    tint = models.CharField(max_length=30)

    def __str__(self) -> str:
        return f"{self.main} {self.second} {self.tint}"