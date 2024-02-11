from rest_framework import viewsets, generics
from .serializers import TobaccoSerializer
from .models import Tobacco
from core.views import DeleteViewMixin
from rest_framework.response import Response
from rest_framework import status
from .filters import TobaccoFilter
from .permissions import IsNotHookah
from rest_framework.permissions import IsAuthenticated
from taste_generator.models import Generator
from rest_framework.decorators import action
from rest_framework.response import Response


class TobaccoViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Tobacco.objects.filter(is_active=True)
    serializer_class = TobaccoSerializer
    filter_backends = [TobaccoFilter]
    permission_classes = [IsAuthenticated, IsNotHookah]

    def create(self, request, *args, **kwargs):
        # If the data is a list, create objects in bulk
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @action(detail=False)
    def get_random_recipes(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        filtered_data = []
        unique_data = set()
        while len(filtered_data) != 3:
            random_records = Generator.objects.filter(is_active=True).order_by("?")[:1]
            for random_record in random_records:
                data = []
                min_counts = {"main": 12, "second": 6, "tint": 2}
                for combination in ["main", "second", "tint"]:
                    queryset_data = (
                        queryset.filter(
                            taste_group=getattr(random_record, combination),
                            weight__gt=min_counts.get(combination, 0),
                        )
                        .order_by("?")
                        .values()
                        .first()
                    )
                    if queryset_data:
                        data.append(queryset_data)
                data_tuple = tuple(tuple(d.items()) for d in data)
                if len(data) == 3 and data_tuple not in unique_data:
                    filtered_data.append(data)
                    unique_data.add(data_tuple)
                    break
        return Response(filtered_data)


class ReduceTobaccoWeightView(generics.GenericAPIView):
    serializer_class = TobaccoSerializer

    def post(self, request):
        try:
            weight_to_reduce = [12, 6, 2]
            data = request.data

            for index, tobacco in enumerate(data):
                tobacco_taste = tobacco["taste"]
                tobacco_taste_group = tobacco["taste_group"]
                weight_to_reduce_current = weight_to_reduce[index]

                try:
                    tobacco_obj = Tobacco.objects.get(
                        taste=tobacco_taste,
                        taste_group=tobacco_taste_group,
                        weight__lt=weight_to_reduce_current,
                    )
                except Tobacco.DoesNotExist:
                    continue

                if tobacco_obj.weight <= weight_to_reduce_current:
                    weight_to_reduce_current -= tobacco_obj.weight
                    weight_to_reduce[index] = weight_to_reduce_current
                    tobacco_obj.weight = 0
                    tobacco_obj.save()

            for index, item in enumerate(data):
                tobacco_id = item["id"]
                weight_to_reduce_current = weight_to_reduce[index]

                tobacco = Tobacco.objects.get(id=tobacco_id)
                if tobacco.weight >= weight_to_reduce_current:
                    tobacco.weight -= weight_to_reduce_current
                    tobacco.save()
                else:
                    return Response(
                        {
                            "error": f"Not enough weight available for tobacco {tobacco_id}"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            return Response(
                {"message": "Tobacco weights reduced successfully"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
