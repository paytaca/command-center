from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, TxCounterViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet)
router.register(r'tx_counters', TxCounterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]