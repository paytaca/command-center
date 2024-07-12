from django.contrib import admin
from .models import Transaction
from .models import Tx_Counter

# Register your models here.
admin.site.register(Transaction)
admin.site.register(Tx_Counter)