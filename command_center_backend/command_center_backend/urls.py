"""
URL configuration for command_center_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from mqtt_listener.views import TransactionViewSet, TxCounterViewSet, UserCreationViewSet, UserCreationCounterViewSet, local_json_file, counter_json_file

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet)
router.register(r'tx_counters', TxCounterViewSet)
router.register(r'user-creation', UserCreationViewSet)
router.register(r'user-creation-counter', UserCreationCounterViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('api/v1/', include('djoser.urls.jwt')),
    path('api/', include(router.urls)),
    path('api/map/', include('paytaca_map.urls')),
    path('api/user-creation/', local_json_file, name='local-json'),
    path('api/user-creation-counter/', counter_json_file, name='local-json')
]
