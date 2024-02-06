from django.urls import include, path
from rest_framework import routers
from .views import TobaccoViewSet, ReduceTobaccoWeightView

router = routers.DefaultRouter()
router.register(r"tobacco", TobaccoViewSet, basename="tobacco")


urlpatterns = [
    path("", include(router.urls)),
    path("reduce_tobacco/", ReduceTobaccoWeightView.as_view(), name="reduce_tobacco"),
]
