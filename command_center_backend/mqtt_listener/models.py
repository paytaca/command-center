from django.db import models
from paytaca_map.models import Merchant

# Create your models here.

#Transaction model
class Transaction(models.Model):
    txid = models.CharField(max_length=200)
    recipient = models.CharField(max_length=200)
    token = models.CharField(max_length=200)
    decimals = models.IntegerField()
    value = models.IntegerField()
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.txid

#Transaction counter model
class Tx_Counter(models.Model):
    count = models.IntegerField(default=0)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return self.counter

#User-creation model
class Wallet(models.Model):
    wallet_id = models.CharField(max_length=200)
    created_at = models.DateField(auto_now_add=True)
    language = models.CharField(max_length=200, null=True)
    currency = models.CharField(max_length=200, null=True)
    country = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.wallet_id

#User-creation counter model
class Wallet_Counter(models.Model):
    count = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.counter

class Rider(models.Model):
    rider_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    revenue = models.DecimalField(max_digits=10, decimal_places=2)
    order_time = models.DateTimeField()
    delivered_time = models.DateTimeField()
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)

    def __str__(self):
        return f'Order {self.order_id}'
