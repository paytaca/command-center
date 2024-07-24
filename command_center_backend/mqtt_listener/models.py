from django.db import models

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
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.counter

#User-creation model
class User_Creation(models.Model):
    user_id = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_id

#User-creation counter model
class User_Creation_Counter(models.Model):
    count = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.counter
