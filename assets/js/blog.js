// Blog JavaScript for Steam Dreams America

// Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Social Sharing Functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackEvent('social_share', 'facebook');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=steamdreamsamerica`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackEvent('social_share', 'twitter');
}

function shareOnInstagram() {
    // Instagram doesn't support direct URL sharing, so we copy the URL
    copyToClipboard();
    showMessage('Link copied! You can now paste it in your Instagram story or bio.', 'success');
    trackEvent('social_share', 'instagram');
}

function shareOnTikTok() {
    // TikTok doesn't support direct URL sharing, so we copy the URL
    copyToClipboard();
    showMessage('Link copied! You can now paste it in your TikTok bio or video description.', 'success');
    trackEvent('social_share', 'tiktok');
}

function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(function() {
        showMessage('Link copied to clipboard!', 'success');
        trackEvent('social_share', 'copy_link');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        showMessage('Failed to copy link. Please copy manually.', 'error');
    });
}

// Message System
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <span class="message-text">${message}</span>
        <button class="message-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            .message {
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            }
            .message-success { background: #28a745; }
            .message-error { background: #dc3545; }
            .message-info { background: #17a2b8; }
            .message-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Donation Modal Functions
function openDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        trackEvent('donation_modal', 'open');
    }
}

function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function selectAmount(amount) {
    const customAmountInput = document.getElementById('custom-amount');
    if (customAmountInput) {
        customAmountInput.value = amount;
    }
    trackEvent('donation_amount', 'select', amount);
}

function processDonation() {
    const customAmountInput = document.getElementById('custom-amount');
    const amount = customAmountInput ? customAmountInput.value : 25;
    
    if (!amount || amount <= 0) {
        showMessage('Please enter a valid amount.', 'error');
        return;
    }
    
    // Cash App integration
    const cashAppUrl = `https://cash.app/$DanteNathanielFord/${amount}`;
    window.open(cashAppUrl, '_blank');
    
    trackEvent('donation', 'process', amount);
    closeDonationModal();
    showMessage('Thank you for your support! Redirecting to Cash App...', 'success');
}

// Newsletter Signup
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate newsletter signup
            showMessage('Thank you for subscribing! Welcome to the Steam Dreams America community.', 'success');
            emailInput.value = '';
            
            trackEvent('newsletter_signup', 'submit', email);
        });
    }
});

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Analytics Tracking
function trackEvent(action, label, value) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'blog_interaction',
            event_label: label,
            value: value
        });
    }
    
    // Console logging for development
    console.log('Event tracked:', { action, label, value });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('donationModal');
    if (event.target === modal) {
        closeDonationModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key closes modal
    if (event.key === 'Escape') {
        closeDonationModal();
    }
    
    // Ctrl/Cmd + K opens donation modal
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openDonationModal();
    }
});

// Reading Progress Bar
function createReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #d4af37, #b8860b);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize reading progress bar
document.addEventListener('DOMContentLoaded', function() {
    createReadingProgressBar();
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
