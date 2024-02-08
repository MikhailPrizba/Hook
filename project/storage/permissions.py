from rest_framework import permissions
from user.models import User


class IsNotHookah(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.

        # Instance must have an attribute named `owner`.
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.user_role != User.UserRoleChoices.HOOKAH


