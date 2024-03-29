from rest_framework import serializers
from hookah.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=None)

    class Meta:
        model = Organization
        fields = "__all__"
