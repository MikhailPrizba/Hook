from rest_framework import serializers
from .models import Generator


class GeneratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Generator
        fields = "__all__"
