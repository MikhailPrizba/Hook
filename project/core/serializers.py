from user.serializers import UserSerializer
from rest_framework import serializers


class SerializerUpdateMixin:
    def update(self, instance, validated_data):
        instance.some_field = validated_data.get("is_active", instance.is_active)

        user_data = validated_data.pop("user", None)
        if user_data:
            user_instance = instance.user
            user_serializer = UserSerializer(
                user_instance, data=user_data, partial=True
            )
            if user_serializer.is_valid():
                # Update user fields
                user_serializer.save()

                # Handle password separately
                if "password" in user_data:
                    user_instance.set_password(user_data["password"])
                    user_instance.save()
            else:
                raise serializers.ValidationError(user_serializer.errors)

        instance.save()
        return instance

    def get_fields(self):
        fields = super().get_fields()
        try:  # Handle DoesNotExist exceptions (you may need it)
            if self.instance and self.instance.user:
                fields["user"].instance = self.instance.user
        except Exception:
            pass
        return fields
