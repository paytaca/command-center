from django.shortcuts import render
from rest_framework import viewsets
from .models import Transaction, Tx_Counter
from .serializers import TransactionSerializer, TxCounterSerializer

# Create your views here.
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('received_at')
    serializer_class = TransactionSerializer

class TxCounterViewSet(viewsets.ModelViewSet):
    queryset = Tx_Counter.objects.all().order_by('date')
    serializer_class = TxCounterSerializer