from rest_framework import viewsets
from .serializers import OwnerSerializer
from .models import Owner
from core.views import DeleteViewMixin
from rest_framework.response import Response


class OwnerViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Owner.objects.filter(is_active=True)
    serializer_class = OwnerSerializer

    def perform_create(self, serializer):
        Owner.objects.create_instance(**serializer.validated_data)
