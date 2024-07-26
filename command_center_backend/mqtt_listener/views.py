from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction, Tx_Counter, Wallet, Wallet_Counter, Order, Rider
from .serializers import TransactionSerializer, TxCounterSerializer, WalletSerializer, WalletCounterSerializer, OrderSerializer, RiderSerializer

# Create your views here.

class TransactionAPIView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all().order_by('received_at')
        serializer_class = TransactionSerializer(transactions, many=True)
        return Response(serializer_class.data)

class TxCounterAPIView(APIView):
    def get(self, request):
        txCounter = Tx_Counter.objects.all().order_by('id')
        serializer_class = TxCounterSerializer(txCounter, many=True)
        return Response(serializer_class.data)

class WalletAPIView(APIView):
    def get(self, request):
        wallet = Wallet.objects.all().order_by('id')
        serializer_class = WalletSerializer(wallet, many=True)
        return Response(serializer_class.data)

class WalletCounterAPIView(APIView):
    def get(self, request):
        walletCounter = Wallet_Counter.objects.all().order_by('date')
        serializer_class = WalletCounterSerializer(walletCounter, many=True)
        return Response(serializer_class.data)

class RiderAPIView(APIView):
    def get(self, request):
        rider = Rider.objects.all().order_by('rider_id')
        serializer_class = RiderSerializer(rider, many=True)
        return Response(serializer_class.data)

class OrderAPIView(APIView):
    def get(self, request):
        order = Order.objects.all().order_by('order_id')
        serializer_class = OrderSerializer(order, many=True)
        return Response(serializer_class.data)
