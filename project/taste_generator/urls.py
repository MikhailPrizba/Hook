from django.urls import path, include
from rest_framework import routers
from .views import RandomOtherItemListView

router = routers.DefaultRouter()
router.register(r"", RandomOtherItemListView, basename="taste_generator")

urlpatterns = [
    path("", include(router.urls)),
]
