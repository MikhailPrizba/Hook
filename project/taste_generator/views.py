from rest_framework import viewsets
from .models import Generator
from .serializers import GeneratorSerializer
from core.views import DeleteViewMixin



class GeneratorViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    serializer_class = GeneratorSerializer
    queryset = Generator.objects.filter(is_active=True)

