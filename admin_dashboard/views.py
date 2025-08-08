from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib.auth.decorators import login_required
import json
from main.models import Payment


@login_required
def dashboard_view(request):
    """Main dashboard view"""
    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', 'all')
    
    # Base queryset
    payments = Payment.objects.all()
    
    # Apply search filter
    if search_query:
        payments = payments.filter(
            Q(name__icontains=search_query) |
            Q(matric_number__icontains=search_query)
        )
    
    # Apply status filter
    if status_filter == 'confirmed':
        payments = payments.filter(confirmed=True)
    elif status_filter == 'pending':
        payments = payments.filter(confirmed=False)
    
    # Pagination
    paginator = Paginator(payments, 20)  # Show 20 payments per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistics
    total_payments = Payment.objects.count()
    confirmed_payments = Payment.objects.filter(confirmed=True).count()
    pending_payments = Payment.objects.filter(confirmed=False).count()
    total_amount = sum(payment.amount for payment in Payment.objects.filter(confirmed=True))
    
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'status_filter': status_filter,
        'stats': {
            'total': total_payments,
            'confirmed': confirmed_payments,
            'pending': pending_payments,
            'total_amount': total_amount,
        }
    }
    
    return render(request, 'admin_dashboard/dashboard.html', context)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def toggle_confirmation(request):
    """Toggle payment confirmation status"""
    try:
        data = json.loads(request.body)
        payment_id = data.get('payment_id')
        confirmed = data.get('confirmed')
        
        payment = get_object_or_404(Payment, id=payment_id)
        payment.confirmed = confirmed
        payment.save()
        
        return JsonResponse({
            'success': True,
            'confirmed': payment.confirmed,
            'message': f'Payment {"confirmed" if confirmed else "unconfirmed"} successfully'
        })
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)


@login_required
def payment_detail(request, payment_id):
    """Get payment details for popup"""
    payment = get_object_or_404(Payment, id=payment_id)
    
    data = {
        'id': payment.id,
        'name': payment.name,
        'matric_number': payment.matric_number,
        'amount': payment.amount,
        'reason': payment.reason or 'No reason provided',
        'receipt_url': payment.receipt.url if payment.receipt else None,
        'confirmed': payment.confirmed,
        'timestamp': payment.timestamp.strftime('%B %d, %Y at %I:%M %p'),
    }
    
    return JsonResponse(data)


@login_required
def dashboard_data(request):
    """API endpoint for real-time data updates"""
    payments = Payment.objects.all()[:20]  # Latest 20 payments
    
    data = []
    for payment in payments:
        data.append({
            'id': payment.id,
            'name': payment.name,
            'matric_number': payment.matric_number,
            'amount': payment.amount,
            'confirmed': payment.confirmed,
            'timestamp': payment.timestamp.strftime('%b %d, %Y %I:%M %p'),
            'receipt_url': payment.receipt.url if payment.receipt else None,
        })
    
    # Statistics
    stats = {
        'total': Payment.objects.count(),
        'confirmed': Payment.objects.filter(confirmed=True).count(),
        'pending': Payment.objects.filter(confirmed=False).count(),
        'total_amount': sum(p.amount for p in Payment.objects.filter(confirmed=True)),
    }
    
    return JsonResponse({
        'payments': data,
        'stats': stats
    })
