from django.urls import include, path
from rest_framework import routers
from .views import OwnerViewSet


router = routers.DefaultRouter()
router.register(r"", OwnerViewSet, basename="owner")

urlpatterns = [
    path("", include(router.urls)),
]
