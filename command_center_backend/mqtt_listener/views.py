from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction, Tx_Counter, Wallet, Wallet_Counter
from .serializers import TransactionSerializer, TxCounterSerializer, WalletSerializer, WalletCounterSerializer

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
        wallet = Wallet.objects.all().order_by('created_at')
        serializer_class = WalletSerializer(wallet, many=True)
        return Response(serializer_class.data)

class WalletCounterAPIView(APIView):
    def get(self, request):
        walletCounter = Wallet_Counter.objects.all().order_by('date')
        serializer_class = WalletCounterSerializer(walletCounter, many=True)
        return Response(serializer_class.data)

# class WalletTestAPIView(APIView):
#     def get(self, request):
#         walletTest = Wallet_Test.objects.all().order_by('date')
#         serializer_class = WalletTestSerializer(walletTest, many=True)
#         return Response(serializer_class.data)
