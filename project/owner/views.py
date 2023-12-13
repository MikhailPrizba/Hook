from rest_framework import viewsets
from .serializers import OwnerSerializer
from .models import Owner


class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer

    def perform_create(self, serializer):
        Owner.objects.create_instance(**serializer.data)
