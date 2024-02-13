from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Tobacco


@receiver(pre_save, sender=Tobacco)
def update_is_active(sender, instance, **kwargs):
    if instance.weight == 0:
        instance.is_active = False
