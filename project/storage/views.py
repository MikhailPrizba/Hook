from rest_framework import viewsets
from .serializers import TobaccoSerializer
from .models import Tobacco


class TobaccoViewSet(viewsets.ModelViewSet):
    queryset = Tobacco.objects.all()
    serializer_class = TobaccoSerializer
