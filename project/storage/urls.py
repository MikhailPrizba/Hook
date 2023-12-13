from django.urls import include, path
from rest_framework import routers
from .views import TobaccoViewSet

router = routers.DefaultRouter()
router.register(r"tobacco", TobaccoViewSet, basename="tobacco")


urlpatterns = [
    path("", include(router.urls)),
]
