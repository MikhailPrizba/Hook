from django.urls import include, path
from rest_framework import routers
from .views import WorkerViewSet


router = routers.DefaultRouter()
router.register(r"", WorkerViewSet, basename="worker")

urlpatterns = [
    path("", include(router.urls)),
]
