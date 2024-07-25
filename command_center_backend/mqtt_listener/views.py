from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction, Tx_Counter, User_Creation, User_Creation_Counter
from .serializers import TransactionSerializer, TxCounterSerializer, UserCreationSerializer, UserCreationCounterSerializer

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

class UserCreationAPIView(APIView):
    def get(self, request):
        userCreation = User_Creation.objects.all().order_by('created_at')
        serializer_class = UserCreationSerializer(userCreation, many=True)
        return Response(serializer_class.data)

class UserCreationCounterAPIView(APIView):
    def get(self, request):
        userCreationCounter = User_Creation_Counter.objects.all().order_by('date')
        serializer_class = UserCreationCounterSerializer(userCreationCounter, many=True)
        return Response(serializer_class.data)
