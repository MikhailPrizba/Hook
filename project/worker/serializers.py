from rest_framework import serializers
from worker.models import Worker
from user.serializers import UserSerializer
from core.serializers import SerializerUpdateMixin
from user.models import User


class WorkerSerializer(SerializerUpdateMixin, serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Worker
        fields = "__all__"

    def create(self, validated_data):
        if self.context["request"].user.user_role == User.UserRoleChoices.ADMIN:
            validated_data["organization"] = self.context[
                "request"
            ].user.worker.organization
        return super().create(validated_data)
