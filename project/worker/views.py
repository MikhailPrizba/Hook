from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .serializers import WorkerSerializer
from .models import Worker
from core.views import DeleteViewMixin


class WorkerViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Worker.objects.filter(is_active=True)
    serializer_class = WorkerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        Worker.objects.create_instance(**serializer.validated_data)
