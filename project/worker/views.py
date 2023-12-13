from rest_framework import viewsets
from .serializers import WorkerSerializer
from .models import Worker


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer

    def perform_create(self, serializer):
        Worker.objects.create_instance(**serializer.data)
