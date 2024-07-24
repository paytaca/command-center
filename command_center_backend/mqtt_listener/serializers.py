from rest_framework import serializers
from .models import Transaction, Tx_Counter, User_Creation, User_Creation_Counter

#Define a serializer for the Transaction model
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction # Model to serialize
        fields = '__all__' # Use all fields in the model

class TxCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tx_Counter # Model to serialize
        fields = '__all__' # Use all fields in the model

#Define a serializer for the User-creation model
class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Creation # Model to serialize
        fields = '__all__' # Use all fields in the model

class UserCreationCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Creation_Counter # Model to serialize
        fields = '__all__' # Use all fields in the model
