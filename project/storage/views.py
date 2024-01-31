from rest_framework import viewsets
from .serializers import TobaccoSerializer
from .models import Tobacco
from core.views import DeleteViewMixin
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class TobaccoViewSet(DeleteViewMixin, viewsets.ModelViewSet):
    queryset = Tobacco.objects.filter(is_active=True)
    serializer_class = TobaccoSerializer

    def create(self, request, *args, **kwargs):
        # If the data is a list, create objects in bulk
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ReduceTobaccoWeightView(APIView):
    def post(self, request, format=None):
        try:
            weight_to_reduce = [12, 6, 2]
            data = request.data

            for index, tobacco in enumerate(data):
                tobacco_taste = tobacco['taste']
                tobacco_taste_group = tobacco['taste_group']
                weight_to_reduce_current = weight_to_reduce[index]

                try:
                    tobacco_obj = Tobacco.objects.get(taste=tobacco_taste, taste_group=tobacco_taste_group,
                                                      weight__lt=weight_to_reduce_current)
                except Tobacco.DoesNotExist:
                    continue

                if tobacco_obj.weight <= weight_to_reduce_current:
                    weight_to_reduce_current -= tobacco_obj.weight
                    weight_to_reduce[index] = weight_to_reduce_current
                    tobacco_obj.weight = 0
                    tobacco_obj.save()

            for index, item in enumerate(data):
                tobacco_id = item['id']
                weight_to_reduce_current = weight_to_reduce[index]

                tobacco = Tobacco.objects.get(id=tobacco_id)
                if tobacco.weight >= weight_to_reduce_current:
                    tobacco.weight -= weight_to_reduce_current
                    tobacco.save()
                else:
                    return Response({'error': f'Not enough weight available for tobacco {tobacco_id}'},
                                    status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Tobacco weights reduced successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)