from rest_framework import viewsets
from storage.models import Tobacco
from .models import Generator
from .serializers import GeneratorSerializer
from core.views import DeleteViewMixin
from rest_framework.decorators import action
from rest_framework.response import Response


class GeneratorViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    serializer_class = GeneratorSerializer
    queryset = Generator.objects.all()

    @action(detail=False)
    def get_random_recipes(self, request, *args, **kwargs):
        filtered_data = []
        random_records = Generator.objects.order_by("?")[:3]
        for random_record in random_records:
            data = []
            min_counts = {"main": 12, "second": 6, "tint": 2}

            for combination in ["main", "second", "tint"]:
                queryset = (
                    Tobacco.objects.filter(
                        taste_group=getattr(random_record, combination),
                        weight__gt=min_counts.get(combination, 0),
                    )
                    .order_by("?")
                    .values()
                    .first()
                )
                if queryset:
                    data.append(queryset)
            filtered_data.append(data)

        return Response(filtered_data)
