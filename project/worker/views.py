from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsNotHookah
from .filters import WorkerFilter
from .serializers import WorkerSerializer
from .models import Worker
from core.views import DeleteViewMixin
from user.models import User
from rest_framework.response import Response
from rest_framework import status


class WorkerViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Worker.objects.filter(is_active=True)
    serializer_class = WorkerSerializer
    filter_backends = [WorkerFilter]
    permission_classes = [IsAuthenticated, IsNotHookah]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if request.user.user_role == User.UserRoleChoices.ADMIN:
            serializer.validated_data["organization"] = request.user.worker.organization
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        Worker.objects.create_instance(**serializer.validated_data)
