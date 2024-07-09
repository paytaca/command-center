from django.db import models

# Create your models here.
class Transaction(models.Model):
    txid = models.CharField(max_length=64, unique=True)
    recipient = models.CharField(max_length=100)
    token = models.CharField(max_length=100)
    decimals = models.IntegerField()
    value = models.IntegerField()
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.txid

class TransactionCounter(models.Model):
    count = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.counter

