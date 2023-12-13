from rest_framework import serializers
from owner.models import Owner
from user.serializers import UserSerializer


class OwnerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Owner
        fields = "__all__"
