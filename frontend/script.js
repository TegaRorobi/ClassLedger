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
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Mobile Menu Management
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

// Form Management
//class PaymentForm {

class PaymentForm {
    //constructor() {
    //    this.form = document.getElementById('paymentForm');
    //    this.fileInput = document.getElementById('receipt');
    //    this.fileText = document.getElementById('fileText');
    //    this.init();
    //}
    //
    //init() {
    //    this.bindEvents();
    //}
    //
    //bindEvents() {
    //    // File upload handling
    //    if (this.fileInput) {
    //        this.fileInput.addEventListener('change', (e) => this.handleFileChange(e));
    //    }
    //
    //    // Form submission
    //    if (this.form) {
    //        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    //    }
    //
    //    // Input animations
    //    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    //    inputs.forEach(input => {
    //        input.addEventListener('focus', (e) => this.handleInputFocus(e));
    //        input.addEventListener('blur', (e) => this.handleInputBlur(e));
    //    });
    //}
    //
    //handleFileChange(e) {
    //    const file = e.target.files[0];
    //    if (file) {
    //        this.fileText.textContent = file.name;
    //        this.fileText.style.color = 'var(--accent-green)';
    //    } else {
    //        this.fileText.textContent = 'Click to upload receipt';
    //        this.fileText.style.color = '';
    //    }
    //}

    constructor() {
        this.form = document.getElementById('paymentForm');
        this.fileInput = document.getElementById('receipt');
        this.fileText = document.getElementById('fileText');
        this.fileUploadDisplay = document.querySelector('.file-upload-display');
        this.filePreviewContainer = document.getElementById('file-preview-container');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // File upload handling
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileChange(e));
        }

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // ... (Input animation handlers remain the same)
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
        });
    }

    handleFileChange(e) {
        const file = e.target.files[0];
        
        // Clear previous preview
        this.filePreviewContainer.innerHTML = '';
        this.filePreviewContainer.classList.add('hidden');
        this.fileUploadDisplay.classList.remove('hidden');

        if (file) {
            this.fileText.textContent = file.name;
            this.fileText.style.color = 'var(--accent-green)';
            
            // New: Display preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.fileUploadDisplay.classList.add('hidden');
                this.filePreviewContainer.classList.remove('hidden');

                if (file.type.startsWith('image/')) {
                    // Create an image preview
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    this.filePreviewContainer.appendChild(img);
                } else if (file.type === 'application/pdf') {
                    // Create a PDF preview with a placeholder icon
                    const pdfPreview = document.createElement('div');
                    pdfPreview.className = 'pdf-preview';
                    pdfPreview.innerHTML = `
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>${file.name}</span>
                    `;
                    this.filePreviewContainer.appendChild(pdfPreview);
                }
            };
            reader.readAsDataURL(file);

        } else {
            this.fileText.textContent = 'Click to upload receipt';
            this.fileText.style.color = '';
            this.fileUploadDisplay.classList.remove('hidden');
        }
    }

    handleInputFocus(e) {
        const input = e.target;
        input.parentElement.style.transform = 'translateY(-2px)';
    }

    handleInputBlur(e) {
        const input = e.target;
        input.parentElement.style.transform = 'translateY(0px)';
    }

    //async handleSubmit(e) {
    //    e.preventDefault();
    //
    //    // Get form data
    //    const formData = new FormData(this.form);
    //    const data = {
    //        name: formData.get('name'),
    //        matricNumber: formData.get('matricNumber'),
    //        reason: formData.get('reason'),
    //        receipt: formData.get('receipt')
    //    };
    //
    //    // Basic validation
    //    if (!data.name || !data.matricNumber || !data.reason) {
    //        this.showMessage('Please fill in all required fields.', 'error');
    //        return;
    //    }
    //
    //    // Show loading state
    //    const submitBtn = this.form.querySelector('.submit-btn');
    //    const originalText = submitBtn.textContent;
    //    submitBtn.textContent = 'Submitting...';
    //    submitBtn.disabled = true;
    //
    //    try {
    //        // Simulate API call (replace with your actual API endpoint)
    //        await this.submitToAPI(data);
    //
    //        // Show success message
    //        this.showMessage('Payment confirmation submitted successfully!', 'success');
    //
    //        // Reset form
    //        this.form.reset();
    //        this.fileText.textContent = 'Click to upload receipt';
    //        this.fileText.style.color = '';
    //
    //    } catch (error) {
    //        console.error('Submission error:', error);
    //        this.showMessage('Failed to submit. Please try again.', 'error');
    //    } finally {
    //        // Reset button
    //        submitBtn.textContent = originalText;
    //        submitBtn.disabled = false;
    //    }
    //}
    
    

  
    //async submitToAPI(data) {
    //    // Replace this with your actual API endpoint
    //    const API_ENDPOINT = 'https://your-api-endpoint.com/submit-payment';
    //
    //    // Create FormData for file upload
    //    const formData = new FormData();
    //    formData.append('name', data.name);
    //    formData.append('matricNumber', data.matricNumber);
    //    formData.append('reason', data.reason);
    //    if (data.receipt) {
    //        formData.append('receipt', data.receipt);
    //    }
    //
    //    const response = await fetch(API_ENDPOINT, {
    //        method: 'POST',
    //        body: formData,
    //        headers: {
    //            // Don't set Content-Type header when using FormData
    //            // 'Authorization': 'Bearer your-token-here' // Add if needed
    //        }
    //    });
    //
    //    if (!response.ok) {
    //        throw new Error(`HTTP error! status: ${response.status}`);
    //    }
    //
    //    return await response.json();
    //}
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Create a FormData object directly from the form
        const formData = new FormData(this.form);

        // Create a data object to check validation
        // The keys here must match your form's 'name' attributes
        const data = {
            name: formData.get('name'),
            matric_number: formData.get('matric_number'),
            amount: formData.get('amount'),
            reason: formData.get('reason'),
            receipt: formData.get('receipt')
        };

        // Basic validation check
        // We check if the values are null, empty strings, or undefined.
        // For the receipt, formData.get() returns a File object if a file is
        // selected, or an empty File object if not. We check if the file size is > 0.
        if (!data.name || !data.matric_number || !data.amount || !data.reason || !data.receipt || data.receipt.size === 0) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            await this.submitToAPI(data);

            this.showMessage('Payment confirmation submitted successfully!', 'success');
            this.form.reset();
            this.fileText.textContent = 'Click to upload receipt';
            this.fileText.style.color = '';
            
            // Reset file preview
            this.filePreviewContainer.innerHTML = '';
            this.filePreviewContainer.classList.add('hidden');
            this.fileUploadDisplay.classList.remove('hidden');

        } catch (error) {
            console.error('Submission error:', error);
            this.showMessage('Failed to submit. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // And ensure your submitToAPI uses the correct keys
    async submitToAPI(data) {
        const API_ENDPOINT = 'http://127.0.0.1:8000/api/payments/';
        //const API_ENDPOINT = 'https://class-ledger.onrender.com/api/payments/';
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('matric_number', data.matric_number);
        formData.append('reason', data.reason);
        formData.append('amount', data.amount);
        
        if (data.receipt instanceof File) {
            formData.append('receipt', data.receipt);
        }

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
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

        // Insert after form
        this.form.parentNode.insertBefore(messageEl, this.form.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Animation Utils
class AnimationUtils {
    static addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe form elements
        const formElements = document.querySelectorAll('.form-group');
        formElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    static addHoverEffects() {
        // Add subtle hover effects to form inputs
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('mouseenter', () => {
                input.style.transform = 'translateY(-1px)';
            });
            
            input.addEventListener('mouseleave', () => {
                if (document.activeElement !== input) {
                    input.style.transform = 'translateY(0)';
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    new ThemeManager();
    new MobileMenu();
    new PaymentForm();
    
    // Add animations
    AnimationUtils.addScrollAnimations();
    AnimationUtils.addHoverEffects();
    
    // Add some interactive feedback
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        formCard.addEventListener('mouseenter', () => {
            formCard.style.transform = 'translateY(-4px) scale(1.01)';
        });
        
        formCard.addEventListener('mouseleave', () => {
            formCard.style.transform = 'translateY(0) scale(1)';
        });
    }
});

// Add some utility functions for potential future use
const Utils = {
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validate file type
    isValidFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']) {
        return allowedTypes.includes(file.type);
    },

    // Show loading spinner
    showLoading(element) {
        element.innerHTML = `
            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
        `;
    }
};
