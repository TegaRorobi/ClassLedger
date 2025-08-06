
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework import (
    viewsets, mixins, status)
from .models import Payment
from .serializers import PaymentSerializer

class Home(APIView):
    def get(self, request, *args, **kwargs): 
        return Response({
            'message': 'Welcome home, soldier',
            'status': status.HTTP_200_OK
        }, status=status.HTTP_200_OK)

class PaymentView(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin):
    serializer_class = PaymentSerializer
    lookup_url_kwarg = 'matric_number'
    # queryset = Payment.objects.all()

    def get_queryset(self):
        return Payment.objects.all()

    def list_all_payments(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def register_new_payment(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, headers=headers, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_payments_by_matric_no(self, request, *args, **kwargs):
        matric_no = kwargs.get(self.lookup_url_kwarg)
        payments = self.get_queryset().filter(matric_number=matric_no)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

