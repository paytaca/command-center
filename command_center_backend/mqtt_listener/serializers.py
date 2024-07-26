from rest_framework import serializers
from .models import Transaction, Tx_Counter, Wallet, Wallet_Counter, Order, Rider
from paytaca_map.models import Merchant

#Define a serializer for the Transaction model
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction # Model to serialize
        fields = '__all__' # Use all fields in the model

class TxCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tx_Counter
        fields = '__all__'

# Define a serializer for the User-creation model
class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'

class WalletCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet_Counter
        fields = '__all__'

class RiderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rider
        fields = '__all__'

class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ['id', 'name']

class OrderSerializer(serializers.ModelSerializer):
    merchant = MerchantSerializer(read_only=True)
    rider = RiderSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


