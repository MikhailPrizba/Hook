from django.urls import path
from .views import ReduceTobaccoWeightView

urlpatterns = [
    path('reduce-tobacco-weight/', ReduceTobaccoWeightView.as_view(), name='reduce_tobacco_weight'),
]
