from rest_framework.filters import BaseFilterBackend


class OwnerFilter(BaseFilterBackend):
    """
    Filter objects based on current user as owner.
    """

    def filter_queryset(self, request, queryset, view):
        if request.user.is_staff:
            return queryset
        return queryset.filter(owner=request.user.owner)
