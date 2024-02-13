from rest_framework.filters import BaseFilterBackend
from user.models import User


class OrganizationFilter(BaseFilterBackend):
    """
    Filter objects based on current user as owner.
    """

    def filter_queryset(self, request, queryset, view):
        if request.user.is_authenticated:
            if request.user.is_staff:
                return queryset
            if request.user.user_role == User.UserRoleChoices.OWNER:
                return queryset.filter(organization__owner=request.user.owner)
            if (
                request.user.user_role == User.UserRoleChoices.ADMIN
                or request.user.user_role == User.UserRoleChoices.HOOKAH
            ):
                return queryset.filter(organization=request.user.worker.organization)
        return queryset.none()
