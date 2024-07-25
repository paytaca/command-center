from django.urls import path
from .views import TransactionAPIView, TxCounterAPIView, WalletAPIView, WalletCounterAPIView
urlpatterns = [
    path('transactions/', TransactionAPIView.as_view(), name='transactions'),
    path('tx_counters/', TxCounterAPIView.as_view(), name='tx_counters'),
    path('wallets/', WalletAPIView.as_view(), name='wallets'),
    path('wallets-counter/', WalletCounterAPIView.as_view(), name='wallets-counter')
    # path('wallets-test/', WalletTestAPIView.as_view(), name='wallets-test')
]

# path('merchant-info/', MerchantInfoAPIView.as_view(), name='merchant-info')
