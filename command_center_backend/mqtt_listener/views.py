import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Transaction, Tx_Counter, User_Creation, User_Creation_Counter
from .serializers import TransactionSerializer, TxCounterSerializer, UserCreationSerializer, UserCreationCounterSerializer

# Create your views here.
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('received_at')
    serializer_class = TransactionSerializer

class TxCounterViewSet(viewsets.ModelViewSet):
    queryset = Tx_Counter.objects.all().order_by('date')
    serializer_class = TxCounterSerializer

class UserCreationViewSet(viewsets.ModelViewSet):
    queryset = User_Creation.objects.all().order_by('created_at')
    serializer_class = UserCreationSerializer

class UserCreationCounterViewSet(viewsets.ModelViewSet):
    queryset = User_Creation_Counter.objects.all().order_by('date')
    serializer_class = UserCreationCounterSerializer

def local_json_file(request):
    # Path to your local JSON file
    file_path = 'C:/Users/Dell/Documents/GitHub/command-center/command_center_backend/mqtt_listener/data/user-creation.json'

    # Open and read the JSON file
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Return the JSON response
    return JsonResponse(data)

def counter_json_file(request):
    # Path to your local JSON file
    file_path = 'C:/Users/Dell/Documents/GitHub/command-center/command_center_backend/mqtt_listener/data/user-creation-counter.json'

    # Open and read the JSON file
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Return the JSON response
    return JsonResponse(data)
