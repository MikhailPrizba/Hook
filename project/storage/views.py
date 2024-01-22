from rest_framework import viewsets
from .serializers import TobaccoSerializer
from .models import Tobacco
from core.views import DeleteViewMixin


class TobaccoViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Tobacco.objects.filter(is_active=True)
    serializer_class = TobaccoSerializer
