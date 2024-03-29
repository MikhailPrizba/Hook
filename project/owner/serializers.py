from rest_framework import serializers
from owner.models import Owner
from user.serializers import UserSerializer
from core.serializers import SerializerUpdateMixin
from user.models import User


class OwnerSerializer(SerializerUpdateMixin, serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Owner
        fields = "__all__"
