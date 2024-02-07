from rest_framework import permissions
from user.models import User


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return (
                request.user.user_role == User.UserRoleChoices.OWNER
                or request.user.is_staff
            )
        return False

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.

        # Instance must have an attribute named `owner`.
        return obj.owner.user == request.user or request.user.is_staff
