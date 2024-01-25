from rest_framework import viewsets
from .serializers import TobaccoSerializer
from .models import Tobacco
from core.views import DeleteViewMixin
from rest_framework.response import Response
from rest_framework import status

class TobaccoViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Tobacco.objects.filter(is_active=True)
    serializer_class = TobaccoSerializer

    def create(self, request, *args, **kwargs):
        # If the data is a list, create objects in bulk
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
