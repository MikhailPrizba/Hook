from rest_framework import serializers
from storage.models import Tobacco


class TobaccoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tobacco
        fields = ['taste', 'taste_group', 'count']
