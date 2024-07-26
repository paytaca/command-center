from django.urls import path
from .views import TransactionAPIView, TxCounterAPIView, WalletAPIView, WalletCounterAPIView, RiderAPIView, OrderAPIView
urlpatterns = [
    path('transactions/', TransactionAPIView.as_view(), name='transactions'),
    path('tx_counters/', TxCounterAPIView.as_view(), name='tx_counters'),
    path('wallets/', WalletAPIView.as_view(), name='wallets'),
    path('wallets-counter/', WalletCounterAPIView.as_view(), name='wallets-counter'),
    path('marketplace/riders/', RiderAPIView.as_view(), name='riders'),
    path('marketplace/orders/', OrderAPIView.as_view(), name='orders')
]

# path('merchant-info/', MerchantInfoAPIView.as_view(), name='merchant-info')
