from django.urls import path, include
from rest_framework import routers
from .views import GeneratorViewSet

router = routers.DefaultRouter()
router.register(r"", GeneratorViewSet, basename="taste_generator")

urlpatterns = [
    path("", include(router.urls)),
]
