from rest_framework import viewsets
from storage.models import Tobacco
from .models import Generator
from storage.serializers import TobaccoSerializer
from random import choice


class RandomOtherItemListView(viewsets.ModelViewSet):
    serializer_class = TobaccoSerializer
    def get_queryset(self):
        filtered_data = []
        for i in range(3):
            random_record = Generator.objects.order_by('?').first()

            min_counts = {'main': 12, 'second': 6, 'tint': 2}

            for combination in ['main', 'second', 'tint']:
                queryset = Tobacco.objects.filter(taste_group=getattr(random_record, combination),
                                                  count__gt=min_counts.get(combination, 0))
                random_item = choice(queryset) if queryset.exists() else None
                if random_item:
                    filtered_data.append(random_item)

        return filtered_data

