from rest_framework import viewsets
from storage.models import Tobacco
from storage.serializers import TobaccoSerializer
import random



generator_list = [
    ["Фруктовые", "Ягодные", "Цитрусовые"],
    ["Фруктовые", "Ягодные", "Алкогольные"],
    ["Фруктовые", "Ягодные", "Пряные"],
    ["Фруктовые", "Ягодные", "Десертные"],
    ["Фруктовые", "Ягодные", "Травянистые"],
    ["Фруктовые", "Ягодные", "Цветочные"],
    ["Фруктовые", "Цитрусовые", "Ягодные"],
    ["Фруктовые", "Цитрусовые", "Алкогольные"],
    ["Фруктовые", "Цитрусовые", "Пряные"],
    ["Фруктовые", "Цитрусовые", "Десертные"],
    ["Фруктовые", "Цитрусовые", "Травянистые"],
    ["Фруктовые", "Цитрусовые", "Цветочные"],
    ["Фруктовые", "Алкогольные", "Ягодные"],
    ["Фруктовые", "Алкогольные", "Цитрусовые"],
    ["Фруктовые", "Алкогольные", "Пряные"],
    ["Фруктовые", "Алкогольные", "Травянистые"],
    ["Фруктовые", "Алкогольные", "Цветочные"],
    ["Фруктовые", "Десертные", "Ягодные"],
    ["Фруктовые", "Десертные", "Цитрусовые"],
    ["Фруктовые", "Десертные", "Алкогольные"],
    ["Фруктовые", "Десертные", "Пряные"],
    ["Фруктовые", "Десертные", "Травянистые"],
    ["Фруктовые", "Десертные", "Ореховые"],
    ["Фруктовые", "Травянистые", "Ягодные"],
    ["Фруктовые", "Травянистые", "Цитрусовые"],
    ["Фруктовые", "Травянистые", "Алкогольные"],
    ["Фруктовые", "Травянистые", "Цветочные"],
    ["Фруктовые", "Ореховые", "Алкогольные"],
    ["Фруктовые", "Ореховые", "Десертные"],
    ["Фруктовые", "Ореховые", "Цветочные"],
    ["Фруктовые", "Цветочные", "Ягодные"],
    ["Фруктовые", "Цветочные", "Цитрусовые"],
    ["Фруктовые", "Цветочные", "Алкогольные"],
    ["Фруктовые", "Цветочные", "Десертные"]
]

class RandomOtherItemListView(viewsets.ModelViewSet):
    serializer_class = TobaccoSerializer
    def get_queryset(self):
        filtered_data = []
        for i in range(3):
            random_combination = random.choice(generator_list)
            min_counts = {random_combination[0]: 12, random_combination[1]: 6, random_combination[2]: 2}
            for combination in [random_combination[0], random_combination[1], random_combination[2]]:
                queryset = Tobacco.objects.filter(taste_group=combination, count__gt=min_counts.get(combination, 0))
                random_item = random.choice(queryset) if queryset.exists() else None
                if random_item:
                    filtered_data.append(random_item)

        return filtered_data

