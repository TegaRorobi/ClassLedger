// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.updateThemeIcons();
    }

    updateThemeIcons() {
        const sunIcons = document.querySelectorAll('.sun-icon');
        const moonIcons = document.querySelectorAll('.moon-icon');
        
        if (this.theme === 'dark') {
            sunIcons.forEach(icon => icon.classList.add('hidden'));
            moonIcons.forEach(icon => icon.classList.remove('hidden'));
        } else {
            sunIcons.forEach(icon => icon.classList.remove('hidden'));
            moonIcons.forEach(icon => icon.classList.add('hidden'));
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Dashboard Management
class DashboardManager {
    constructor() {
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoRefresh();
    }

    bindEvents() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Auto-refresh every 30 seconds
        this.startAutoRefresh();
    }

    startAutoRefresh() {
        // Refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    async refreshData() {
        try {
            const response = await fetch('/admin-dashboard/api/dashboard-data/');
            const data = await response.json();
            
            // Update statistics in navbar
            this.updateStats(data.stats);
            
            // Optionally update payment list without full page reload
            // this.updatePaymentsList(data.payments);
            
            this.showMessage('Data refreshed successfully', 'success');
        } catch (error) {
            console.error('Refresh error:', error);
            this.showMessage('Failed to refresh data', 'error');
        }
    }

    updateStats(stats) {
        const statElements = {
            total: document.querySelector('.stat-value'),
            confirmed: document.querySelectorAll('.stat-value')[1],
            pending: document.querySelectorAll('.stat-value')[2],
            total_amount: document.querySelectorAll('.stat-value')[3]
        };

        if (statElements.total) statElements.total.textContent = stats.total;
        if (statElements.confirmed) statElements.confirmed.textContent = stats.confirmed;
        if (statElements.pending) statElements.pending.textContent = stats.pending;
        if (statElements.total_amount) statElements.total_amount.textContent = `₦${stats.total_amount}`;
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type} show`;
        messageEl.textContent = message;

        // Add to page
        document.body.appendChild(messageEl);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }
}

// Payment Management Functions
async function toggleConfirmation(paymentId, confirmed) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        // Show loading
        loadingOverlay.classList.remove('hidden');
        
        const response = await fetch('/admin-dashboard/toggle-confirmation/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                payment_id: paymentId,
                confirmed: confirmed
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // Update the status badge
            updatePaymentStatus(paymentId, data.confirmed);
            
            // Show success message
            showMessage(data.message, 'success');
        } else {
            // Revert checkbox if failed
            const checkbox = document.querySelector(`input[onchange*="${paymentId}"]`);
            if (checkbox) {
                checkbox.checked = !confirmed;
            }
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Toggle confirmation error:', error);
        
        // Revert checkbox
        const checkbox = document.querySelector(`input[onchange*="${paymentId}"]`);
        if (checkbox) {
            checkbox.checked = !confirmed;
        }
        
        showMessage('Failed to update confirmation status', 'error');
    } finally {
        // Hide loading
        loadingOverlay.classList.add('hidden');
    }
}

function updatePaymentStatus(paymentId, confirmed) {
    const paymentCard = document.querySelector(`[data-payment-id="${paymentId}"]`);
    if (!paymentCard) return;

    const statusBadge = paymentCard.querySelector('.status-badge');
    const statusIcon = statusBadge.querySelector('.status-icon');
    
    if (confirmed) {
        statusBadge.className = 'status-badge confirmed';
        statusBadge.innerHTML = `
            <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Confirmed
        `;
    } else {
        statusBadge.className = 'status-badge pending';
        statusBadge.innerHTML = `
            <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Pending
        `;
    }
}

async function viewPaymentDetails(paymentId) {
    const modal = document.getElementById('paymentModal');
    const modalContent = document.getElementById('modalContent');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        // Show loading
        loadingOverlay.classList.remove('hidden');
        
        const response = await fetch(`/admin-dashboard/payment/${paymentId}/`);
        const payment = await response.json();
        
        // Build modal content
        modalContent.innerHTML = `
            <div class="modal-detail-grid">
                <div class="modal-detail-row">
                    <svg class="modal-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                    <span class="modal-detail-label">ID:</span>
                    <span class="modal-detail-value">${payment.id}</span>
                </div>
                
                <div class="modal-detail-row">
                    <svg class="modal-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="modal-detail-label">Name:</span>
                    <span class="modal-detail-value">${payment.name}</span>
                </div>
                
                <div class="modal-detail-row">
                    <svg class="modal-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                    <span class="modal-detail-label">Matric:</span>
                    <span class="modal-detail-value">${payment.matric_number}</span>
                </div>
                
                <div class="modal-detail-row">
                    <svg class="modal-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span class="modal-detail-label">Amount:</span>
                    <span class="modal-detail-value" style="color: var(--accent-green); font-weight: 700;">₦${payment.amount}</span>
                </div>
                
                <div class="modal-detail-row">
                    <svg class="modal-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span class="modal-detail-label">Reason:</span>
                    <span class="modal-detail-value">${payment.reason}</span>
                </div>
                
                <div class="modal-detail-row">
                    <svg class="modal-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="modal-detail-label">Date:</span>
                    <span class="modal-detail-value">${payment.timestamp}</span>
                </div>
                
                <div class="modal-detail-row">
                    <svg class="modal-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="modal-detail-label">Status:</span>
                    <span class="modal-detail-value" style="color: ${payment.confirmed ? 'var(--accent-green)' : '#f59e0b'}; font-weight: 600;">
                        ${payment.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                </div>
            </div>
            
            ${payment.receipt_url ? `
                <div class="modal-receipt-preview">
                    <h4 style="margin-bottom: 1rem; color: var(--text-primary); font-weight: 600;">Receipt Preview</h4>
                    <img src="${payment.receipt_url}" alt="Receipt" class="modal-receipt-image" />
                </div>
            ` : ''}
        `;
        
        // Show modal
        modal.classList.remove('hidden');
        
    } catch (error) {
        console.error('View payment details error:', error);
        showMessage('Failed to load payment details', 'error');
    } finally {
        // Hide loading
        loadingOverlay.classList.add('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.add('hidden');
}

// Utility Functions
function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}

function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type} show`;
    messageEl.textContent = message;

    // Add to page
    document.body.appendChild(messageEl);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    new ThemeManager();
    new DashboardManager();
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('paymentModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
