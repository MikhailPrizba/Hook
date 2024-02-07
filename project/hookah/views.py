from rest_framework import viewsets
from .serializers import OrganizationSerializer
from .models import Organization
from core.views import DeleteViewMixin
from .permissions import IsOwner
from .filters import OwnerFilter
from rest_framework.permissions import IsAuthenticated


class OrganiztionViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Organization.objects.filter(is_active=True)
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [OwnerFilter]

    def perform_create(self, serializer):
        serializer.validated_data["owner"] = self.request.user.owner
        serializer.save()
