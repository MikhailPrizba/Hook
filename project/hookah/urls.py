from django.urls import include, path
from rest_framework import routers
from .views import OrganiztionViewSet

router = routers.DefaultRouter()
router.register(r"", OrganiztionViewSet, basename="organization")

urlpatterns = [
    path("", include(router.urls)),
]
