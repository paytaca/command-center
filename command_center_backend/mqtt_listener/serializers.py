from rest_framework import serializers
from .models import Transaction, Tx_Counter

#Define a serializer for the Transaction model
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction # Model to serialize
        fields = '__all__' # Use all fields in the model

class TxCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tx_Counter # Model to serialize
        fields = '__all__' # Use all fields in the model