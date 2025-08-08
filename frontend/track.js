// Payment Tracking Management
class PaymentTracker {
    constructor() {
        this.form = document.getElementById('trackingForm');
        this.searchContainer = document.getElementById('searchContainer');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.loadingState = document.getElementById('loadingState');
        this.paymentCards = document.getElementById('paymentCards');
        this.recordCount = document.getElementById('recordCount');
        this.backButton = document.getElementById('backButton');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Back button
        if (this.backButton) {
            this.backButton.addEventListener('click', () => this.showSearchForm());
        }
    }

    async handleSearch(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const matricNumber = formData.get('matricNumber');

        if (!matricNumber) {
            this.showMessage('Please enter your matriculation number.', 'error');
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Call API to get payment records
            const payments = await this.fetchPayments(matricNumber);
            
            // Show results
            this.showResults(payments, matricNumber);
            
        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('Failed to fetch payment records. Please try again.', 'error');
            this.showSearchForm();
        }
    }

    async fetchPayments(matricNumber) {
        // Replace with your actual API endpoint
        const API_ENDPOINT = `http://localhost:8000/api/payments/${matricNumber}/`;
        //const API_ENDPOINT = `https://class-ledger.onrender.com/api/payments/${matricNumber}/`;
        // For demo purposes, return mock data after a delay
        // Remove this and uncomment the actual API call below
        //await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data for demonstration
        //return [
        //    {
        //        "id": 4,
        //        "name": "Oghenetega Rorobi",
        //        "matric_number": matricNumber,
        //        "amount": 200,
        //        "reason": "Course materials and lab manual",
        //        "receipt": "http://127.0.0.1:8000/media/receipt_images/Screenshot_10.png",
        //        "confirmed": true,
        //        "timestamp": "2025-08-03T13:55:53.476959Z"
        //    },
        //    {
        //        "id": 1,
        //        "name": "Oghenetega Rorobi",
        //        "matric_number": matricNumber,
        //        "amount": 200,
        //        "reason": "Department levy for semester activities",
        //        "receipt": "http://127.0.0.1:8000/media/receipt_images/Screenshot_52.png",
        //        "confirmed": false,
        //        "timestamp": "2025-08-02T22:55:29.212018Z"
        //    }
        //];

        // Actual API call (uncomment and modify as needed)
        ///*
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer your-token-here' // Add if needed
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
        //*/
    }

    showLoading() {
        this.searchContainer.classList.add('hidden');
        this.resultsContainer.classList.add('hidden');
        this.loadingState.classList.remove('hidden');
    }

    showSearchForm() {
        this.searchContainer.classList.remove('hidden');
        this.resultsContainer.classList.add('hidden');
        this.loadingState.classList.add('hidden');
        
        // Clear form
        this.form.reset();
        
        // Clear any existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    showResults(payments, matricNumber) {
        this.searchContainer.classList.add('hidden');
        this.loadingState.classList.add('hidden');
        
        // Update record count
        this.recordCount.textContent = payments.length;
        
        // Clear existing cards
        this.paymentCards.innerHTML = '';
        
        if (payments.length === 0) {
            this.showNoResults(matricNumber);
        } else {
            // Create payment cards
            payments.forEach((payment, index) => {
                const card = this.createPaymentCard(payment, index);
                this.paymentCards.appendChild(card);
            });
        }
        
        this.resultsContainer.classList.remove('hidden');
    }

    showNoResults(matricNumber) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">No Payment Records Found</h3>
            <p>No payment records were found for matriculation number: <strong>${matricNumber}</strong></p>
            <p style="margin-top: 0.5rem; font-size: 0.875rem;">Please check your matriculation number or contact support if you believe this is an error.</p>
        `;
        this.paymentCards.appendChild(noResultsDiv);
    }

    createPaymentCard(payment, index) {
        const card = document.createElement('div');
        card.className = 'payment-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const isConfirmed = payment.confirmed;
        const statusClass = isConfirmed ? 'confirmed' : 'pending';
        const statusText = isConfirmed ? 'Confirmed' : 'Pending';
        const statusIcon = isConfirmed ? 
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
        
        // Format timestamp
        const timestamp = new Date(payment.timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Handle reason display
        const reasonDisplay = payment.reason || 'No reason provided';

        card.innerHTML = `
            <div class="payment-card-gradient"></div>
            
            <div class="payment-card-header">
                <div class="payment-id">ID: ${payment.id}</div>
                <div class="payment-status status-${statusClass}">
                    <svg class="status-icon ${statusClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${statusIcon}
                    </svg>
                    ${statusText}
                </div>
            </div>

            <div class="payment-info">
                <div class="info-row">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="info-label">Name:</span>
                    <span class="info-value">${payment.name}</span>
                </div>

                <div class="info-row">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                    <span class="info-label">Matric:</span>
                    <span class="info-value">${payment.matric_number}</span>
                </div>

                <div class="info-row">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span class="info-label">Amount:</span>
                    <span class="info-value amount-value">₦${payment.amount}</span>
                </div>

                <div class="info-row">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span class="info-label">Reason:</span>
                    <span class="info-value reason-value">${reasonDisplay}</span>
                </div>

                <div class="info-row">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span class="info-label">Receipt:</span>
                    <a href="${payment.receipt}" target="_blank" class="info-value receipt-link">View Receipt</a>
                </div>

                <div class="info-row">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="info-label">Date:</span>
                    <span class="info-value timestamp-value">${timestamp}</span>
                </div>
            </div>
        `;

        return card;
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message show`;
        messageEl.textContent = message;

        // Insert after search form
        this.searchContainer.parentNode.insertBefore(messageEl, this.searchContainer.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Theme Management (reuse from main script)
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
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Mobile Menu Management (reuse from main script)
class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const mobileMenu = document.getElementById('mobileMenu');
        const menuIcon = document.querySelector('.menu-icon');
        const closeIcon = document.querySelector('.close-icon');
        
        if (this.isOpen) {
            mobileMenu.classList.add('show');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        } else {
            mobileMenu.classList.remove('show');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }

    bindEvents() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggle());
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (this.isOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.toggle();
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    new ThemeManager();
    new MobileMenu();
    new PaymentTracker();
});
