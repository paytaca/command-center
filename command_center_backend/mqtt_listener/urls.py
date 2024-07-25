from django.urls import path
from .views import TransactionAPIView, TxCounterAPIView, UserCreationAPIView, UserCreationCounterAPIView

urlpatterns = [
    path('transactions/', TransactionAPIView.as_view(), name='merchant-list'),
    path('tx_counters/', TxCounterAPIView.as_view(), name='location-list'),
    path('user-creation/', UserCreationAPIView.as_view(), name='category-list'),
    path('user-creation-counter/', UserCreationCounterAPIView.as_view(), name='logo-list')
]

# path('merchant-info/', MerchantInfoAPIView.as_view(), name='merchant-info')
