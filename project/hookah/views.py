from rest_framework import viewsets
from .serializers import OrganizationSerializer
from .models import Organization


class OrganiztionViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def perform_create(self, serializer):
        serializer.validated_data["owner"] = self.request.user.owner
        serializer.save()
