from django.urls import path
from apps.analytics.views import DashboardView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
]
