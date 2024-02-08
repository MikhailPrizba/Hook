from rest_framework import serializers
from storage.models import Tobacco
from user.models import User


class TobaccoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tobacco
        fields = "__all__"

    def create(self, validated_data):
        if self.context["request"].user.user_role == User.UserRoleChoices.ADMIN:
            validated_data["organization"] = self.context[
                "request"
            ].user.worker.organization
        return super().create(validated_data)
