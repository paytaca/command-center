from rest_framework import serializers
from .models import Transaction, Tx_Counter

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class TxCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tx_Counter
        fields = '__all__'