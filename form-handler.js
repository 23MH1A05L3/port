// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (!form) {
        console.warn('Contact form not found');
        return;
    }
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear validation state on input
            this.classList.remove('is-valid', 'is-invalid');
        });
    });
    
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Name validation (minimum 2 characters)
        if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }
        
        // Message validation (minimum 10 characters)
        if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }
        
        // Update field validation state
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            
            // Update error message
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = errorMessage;
            }
        }
        
        return isValid;
    }
    
    function submitForm() {
        // Show loading state
        setLoadingState(true);
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            // Simulate success/error randomly for demo
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                handleSubmissionSuccess(data);
            } else {
                handleSubmissionError();
            }
            
            setLoadingState(false);
        }, 2000);
    }
    
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            btnText.style.display = 'none';
            btnLoading.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            btnText.style.display = 'inline';
            btnLoading.classList.add('d-none');
        }
    }
    
    function handleSubmissionSuccess(data) {
        // Show success toast
        showToast('success', 'Message sent successfully! I\'ll get back to you soon.');
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
        // Log form data (in real app, this would be sent to server)
        console.log('Form submitted successfully:', data);
        
        // Optional: Track form submission analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Contact',
                event_label: 'Contact Form'
            });
        }
    }
    
    function handleSubmissionError() {
        // Show error toast
        showToast('error', 'Failed to send message. Please try again.');
        
        // Optional: Track form submission error
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_error', {
                event_category: 'Contact',
                event_label: 'Contact Form Error'
            });
        }
    }
}

// Toast notification system
function showToast(type, message) {
    const toastId = type === 'success' ? 'successToast' : 'errorToast';
    const toastElement = document.getElementById(toastId);
    
    if (!toastElement) {
        console.warn(`Toast element not found: ${toastId}`);
        return;
    }
    
    // Update message if needed
    const toastBody = toastElement.querySelector('.toast-body');
    if (toastBody && message) {
        toastBody.textContent = message;
    }
    
    // Show toast using Bootstrap
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        toast.show();
    } else {
        // Fallback for browsers without Bootstrap
        showFallbackNotification(type, message);
    }
}

// Fallback notification system
function showFallbackNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        <strong>${type === 'success' ? 'Success!' : 'Error!'}</strong> ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Form utility functions
function sanitizeInput(input) {
    // Basic input sanitization
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Basic phone validation (adjust regex based on requirements)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Character counter for textarea
function initializeCharacterCounter() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        if (!maxLength) return;
        
        // Create counter element
        const counter = document.createElement('small');
        counter.className = 'text-muted d-block mt-1';
        counter.textContent = `0 / ${maxLength}`;
        
        // Insert after textarea
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        
        // Update counter on input
        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;
            
            // Change color based on usage
            if (currentLength > maxLength * 0.9) {
                counter.className = 'text-warning d-block mt-1';
            } else if (currentLength === maxLength) {
                counter.className = 'text-danger d-block mt-1';
            } else {
                counter.className = 'text-muted d-block mt-1';
            }
        });
    });
}

// Auto-resize textarea
function initializeAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Initialize additional form features
document.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCounter();
    initializeAutoResize();
});

// Export functions for testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        sanitizeInput,
        showToast
    };
}