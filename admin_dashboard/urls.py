from django.urls import path
from . import views

app_name = 'admin_dashboard'

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('toggle-confirmation/', views.toggle_confirmation, name='toggle_confirmation'),
    path('payment/<int:payment_id>/', views.payment_detail, name='payment_detail'),
    path('api/dashboard-data/', views.dashboard_data, name='dashboard_data'),
]
