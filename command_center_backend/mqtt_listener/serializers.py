from rest_framework import serializers
from .models import Transaction, Tx_Counter, Wallet, Wallet_Counter

#Define a serializer for the Transaction model
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction # Model to serialize
        fields = '__all__' # Use all fields in the model

class TxCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tx_Counter # Model to serialize
        fields = '__all__' # Use all fields in the model

# Define a serializer for the User-creation model
class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet # Model to serialize
        fields = '__all__' # Use all fields in the model

class WalletCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet_Counter # Model to serialize
        fields = '__all__' # Use all fields in the model

# class WalletTestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Wallet_Test # Model to serialize
#         fields = '__all__' # Use all fields in the model
