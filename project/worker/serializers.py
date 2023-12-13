from rest_framework import serializers
from worker.models import Worker
from user.serializers import UserSerializer


class WorkerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Worker
        fields = "__all__"
