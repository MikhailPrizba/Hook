from rest_framework import serializers
from worker.models import Worker
from user.serializers import UserSerializer
from core.serializers import SerializerUpdateMixin


class WorkerSerializer(SerializerUpdateMixin, serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Worker
        fields = "__all__"
