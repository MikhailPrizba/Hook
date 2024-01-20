from rest_framework import serializers
from storage.models import Tobacco


class TobaccoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tobacco
        fields = "__all__"
