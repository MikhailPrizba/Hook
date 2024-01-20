from django.shortcuts import render

# Create your views here.


class DeleteViewMixin:
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
