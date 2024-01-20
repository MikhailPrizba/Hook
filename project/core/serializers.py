from user.serializers import UserSerializer
from rest_framework import serializers


class SerializerUpdateMixin:
    def update(self, instance, validated_data):
        instance.some_field = validated_data.get("is_active", instance.is_active)

        user_data = validated_data.pop("user", None)
        if user_data:
            user_instance = instance.user
            user_serializer = UserSerializer(user_instance, data=user_data)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                raise serializers.ValidationError(user_serializer.errors)

        instance.save()
        return instance
