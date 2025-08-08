from .views import Home, PaymentView
from django.urls import path

app_name = 'main'

paymentview_actions = {
    'get': 'list_all_payments',
    'post': 'register_new_payment',
}
urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('payments/', PaymentView.as_view(paymentview_actions), name='paymentview'),
    path('payments/<int:matric_number>/', PaymentView.as_view({'get': 'get_payments_by_matric_no'}), name='paymentview22'),
]
