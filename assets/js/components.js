// Component JavaScript for Steam Dreams America

// Enhanced modal functionality
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.init();
    }
    
    init() {
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            this.activeModal = modal;
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            this.activeModal = null;
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
}

// Enhanced form validation
class FormValidator {
    constructor() {
        this.init();
    }
    
    init() {
        // Real-time email validation
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateEmail(e.target);
            });
        });
        
        // Real-time ZIP code validation
        document.querySelectorAll('input[name="zip"], #zip-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateZipCode(e.target);
            });
        });
    }
    
    validateEmail(input) {
        const email = input.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            input.classList.add('error');
            this.showError(input, 'Please enter a valid email address');
        } else {
            input.classList.remove('error');
            this.removeError(input);
        }
    }
    
    validateZipCode(input) {
        const zip = input.value;
        const zipRegex = /^\d{5}(-\d{4})?$/;
        
        if (zip && !zipRegex.test(zip)) {
            input.classList.add('error');
            this.showError(input, 'Please enter a valid ZIP code');
        } else {
            input.classList.remove('error');
            this.removeError(input);
        }
    }
    
    showError(input, message) {
        this.removeError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-text';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    removeError(input) {
        const errorDiv = input.parentNode.querySelector('.error-text');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

// Enhanced loading states
class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
    }
    
    showLoading(elementId, message = 'Loading...') {
        const element = document.getElementById(elementId);
        if (element) {
            this.loadingStates.set(elementId, element.innerHTML);
            
            element.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;
        }
    }
    
    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        const originalContent = this.loadingStates.get(elementId);
        
        if (element && originalContent) {
            element.innerHTML = originalContent;
            this.loadingStates.delete(elementId);
        }
    }
    
    showSpinner(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="spinner"></div>';
        }
    }
}

// Enhanced message system
class MessageManager {
    constructor() {
        this.messageContainer = null;
        this.init();
    }
    
    init() {
        // Create message container
        this.messageContainer = document.createElement('div');
        this.messageContainer.id = 'message-container';
        this.messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            max-width: 400px;
        `;
        document.body.appendChild(this.messageContainer);
    }
    
    showMessage(message, type = 'info', duration = 5000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.cssText = `
            margin-bottom: 10px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Add icon based on type
        const icon = this.getIconForType(type);
        alertDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2em;">${icon}</span>
                <span>${message}</span>
            </div>
        `;
        
        this.messageContainer.appendChild(alertDiv);
        
        // Auto remove after duration
        setTimeout(() => {
            this.removeMessage(alertDiv);
        }, duration);
        
        return alertDiv;
    }
    
    removeMessage(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }
    }
    
    getIconForType(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Enhanced donation system
class DonationManager {
    constructor() {
        this.selectedAmount = 0;
        this.init();
    }
    
    init() {
        // Handle donation amount selection
        document.querySelectorAll('.btn-donation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAmount(parseInt(e.target.textContent.replace('$', '')));
            });
        });
        
        // Handle custom amount input
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.addEventListener('input', (e) => {
                this.selectedAmount = parseInt(e.target.value) || 0;
                this.updateDonationButtons();
            });
        }
    }
    
    selectAmount(amount) {
        this.selectedAmount = amount;
        this.updateDonationButtons();
        
        // Update custom amount field
        const customAmountInput = document.getElementById('custom-amount');
        if (customAmountInput) {
            customAmountInput.value = amount;
        }
    }
    
    updateDonationButtons() {
        document.querySelectorAll('.btn-donation').forEach(btn => {
            const btnAmount = parseInt(btn.textContent.replace('$', ''));
            if (btnAmount === this.selectedAmount) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
    
    processDonation() {
        if (!this.selectedAmount || this.selectedAmount <= 0) {
            messageManager.showMessage('Please select a donation amount.', 'error');
            return;
        }
        
        if (this.selectedAmount > 10000) {
            messageManager.showMessage('Donation amount cannot exceed $10,000.', 'error');
            return;
        }
        
        // Check rate limiting
        if (isRateLimited()) {
            messageManager.showMessage('Too many donation attempts. Please try again later.', 'error');
            return;
        }
        
        // Log donation attempt
        logDonationAttempt(this.selectedAmount, true);
        
        // Redirect to Cash App
        const cashAppUrl = `https://cash.app/$DanteNathanielFord/${this.selectedAmount}`;
        window.open(cashAppUrl, '_blank');
        
        // Track event
        if (typeof trackEvent === 'function') {
            trackEvent('donation_attempt', 'engagement', this.selectedAmount);
        }
        
        // Close modal and show success message
        modalManager.closeModal(document.getElementById('donationModal'));
        messageManager.showMessage('Thank you for your support! You\'ve been redirected to Cash App to complete your donation.', 'success');
    }
}

// Enhanced social sharing
class SocialSharingManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize social sharing buttons
        this.setupFacebookSharing();
        this.setupTwitterSharing();
        this.setupLinkedInSharing();
    }
    
    setupFacebookSharing() {
        window.shareOnFacebook = () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Transform America\'s ports into opportunity engines through STEAM education. Join Steam Dreams America!');
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
            
            if (typeof trackEvent === 'function') {
                trackEvent('social_share', 'engagement', 'facebook');
            }
        };
    }
    
    setupTwitterSharing() {
        window.shareOnTwitter = () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Transform America\'s ports into opportunity engines through STEAM education. Join Steam Dreams America! #SteamDreamsAmerica #AmericanRenewal');
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
            
            if (typeof trackEvent === 'function') {
                trackEvent('social_share', 'engagement', 'twitter');
            }
        };
    }
    
    setupLinkedInSharing() {
        window.shareOnLinkedIn = () => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent('Steam Dreams America - A Hero\'s Journey');
            const summary = encodeURIComponent('Transform America\'s ports into opportunity engines through STEAM education.');
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
            
            if (typeof trackEvent === 'function') {
                trackEvent('social_share', 'engagement', 'linkedin');
            }
        };
    }
}

// Enhanced analytics tracking
class AnalyticsManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Track page views
        this.trackPageView();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track scroll depth
        this.trackScrollDepth();
    }
    
    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'Steam Dreams America',
                page_location: window.location.href
            });
        }
    }
    
    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn')) {
                this.trackEvent('button_click', 'engagement', e.target.textContent.trim());
            }
            
            if (e.target.matches('.nav-link')) {
                this.trackEvent('navigation', 'engagement', e.target.textContent.trim());
            }
            
            if (e.target.matches('.port-card, .rep-card')) {
                this.trackEvent('card_click', 'engagement', e.target.closest('.port-card, .rep-card').querySelector('h4')?.textContent);
            }
        });
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track at 25%, 50%, 75%, 100%
                if ([25, 50, 75, 100].includes(maxScroll)) {
                    this.trackEvent('scroll_depth', 'engagement', `${maxScroll}%`);
                }
            }
        });
    }
    
    trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Also log to console for debugging
        console.log('Analytics Event:', { action, category, label });
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.modalManager = new ModalManager();
    window.formValidator = new FormValidator();
    window.loadingManager = new LoadingManager();
    window.messageManager = new MessageManager();
    window.donationManager = new DonationManager();
    window.socialSharingManager = new SocialSharingManager();
    window.analyticsManager = new AnalyticsManager();
});

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
