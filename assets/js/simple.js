// Simplified JavaScript for Steam Dreams America - Core Functionality

// Global variables
let selectedDonationAmount = 0;
const rateLimitStore = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSecurity();
    initializeEmailSignup();
    initializeSocialSharing();
    initializeModals();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Security functionality
function initializeSecurity() {
    // Add CSRF protection to forms
    addCSRFToken();
    
    // Add input validation
    addInputValidation();
    
    // Prevent form resubmission
    preventFormResubmission();
    
    // Monitor security events
    monitorSecurityEvents();
}

// Email signup functionality
function initializeEmailSignup() {
    const emailForm = document.getElementById('email-signup-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email-input').value;
            const zip = document.getElementById('zip-input').value;
            
            // Rate limiting
            if (isRateLimited('email_signup', 1, 60000)) {
                showMessage('Please wait before submitting another email.', 'warning');
                return;
            }
            
            // Validate email
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Sanitize inputs
            const sanitizedEmail = sanitizeInput(email);
            const sanitizedZip = sanitizeInput(zip);
            
            // Show loading state
            showLoading('Subscribing...');
            
            // Simulate API call
            setTimeout(() => {
                hideLoading();
                showMessage('Thank you for subscribing! We\'ll keep you updated on our mission to grow America the right way.', 'success');
                emailForm.reset();
            }, 2000);
        });
    }
}

// Social sharing functionality
function initializeSocialSharing() {
    // Make functions globally available
    window.shareOnFacebook = shareOnFacebook;
    window.shareOnTwitter = shareOnTwitter;
    window.shareOnInstagram = shareOnInstagram;
    window.shareOnTikTok = shareOnTikTok;
}

// Modal functionality
function initializeModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Security functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, '').trim();
}

function validateDonationAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= 1 && num <= 10000;
}

function isRateLimited(action, limit = 5, windowMs = 60000) {
    const now = Date.now();
    const clientId = getClientId();
    const key = `${action}_${clientId}`;
    
    if (!rateLimitStore[key]) {
        rateLimitStore[key] = [];
    }
    
    // Remove old entries
    rateLimitStore[key] = rateLimitStore[key].filter(time => now - time < windowMs);
    
    if (rateLimitStore[key].length >= limit) {
        return true;
    }
    
    rateLimitStore[key].push(now);
    return false;
}

function getClientId() {
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
        clientId = 'client_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('clientId', clientId);
    }
    return clientId;
}

function addCSRFToken() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const token = Math.random().toString(36).substr(2, 9);
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'csrf_token';
        input.value = token;
        form.appendChild(input);
    });
}

function addInputValidation() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.type === 'email' && this.value) {
                if (!validateEmail(this.value)) {
                    this.style.borderColor = '#ff4444';
                } else {
                    this.style.borderColor = '#d4af37';
                }
            }
        });
    });
}

function preventFormResubmission() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
        });
    });
}

function monitorSecurityEvents() {
    // Log security events (in a real app, this would go to a security service)
    console.log('Security monitoring initialized');
}

// Social sharing functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Join Steam Dreams America in growing America the right way through bipartisan collaboration and grounded leadership!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    trackEvent('social_share', 'facebook');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Join Steam Dreams America in growing America the right way through bipartisan collaboration and grounded leadership!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    trackEvent('social_share', 'twitter');
}

function shareOnInstagram() {
    const text = 'Join Steam Dreams America in growing America the right way through bipartisan collaboration and grounded leadership!';
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Text copied! Please paste it in your Instagram story or post.', 'success');
    }).catch(() => {
        showMessage('Please copy this text and share it on Instagram: ' + text, 'info');
    });
    trackEvent('social_share', 'instagram');
}

function shareOnTikTok() {
    const text = 'Join Steam Dreams America in growing America the right way through bipartisan collaboration and grounded leadership!';
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Text copied! Please paste it in your TikTok video description.', 'success');
    }).catch(() => {
        showMessage('Please copy this text and share it on TikTok: ' + text, 'info');
    });
    trackEvent('social_share', 'tiktok');
}

// Modal functions
function openLocationModal() {
    document.getElementById('locationModal').style.display = 'block';
}

function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
}

function openDonationModal() {
    document.getElementById('donationModal').style.display = 'block';
}

function closeDonationModal() {
    document.getElementById('donationModal').style.display = 'none';
}

// Location functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        showLoading('Getting your location...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                hideLoading();
                findPortsByCoordinates(position.coords.latitude, position.coords.longitude);
            },
            function(error) {
                hideLoading();
                showMessage('Unable to get your location. Please use the search option.', 'error');
            }
        );
    } else {
        showMessage('Geolocation is not supported by your browser. Please use the search option.', 'error');
    }
}

function submitLocation() {
    const location = document.getElementById('manual-location').value;
    if (!location.trim()) {
        showMessage('Please enter a location.', 'error');
        return;
    }
    
    showLoading('Searching for port communities...');
    findPortsByLocation(location);
}

function findPortsByLocation(location) {
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        const mockResults = [
            { name: 'Port of ' + location, distance: '5 miles', opportunities: 'STEAM Education, Maritime Training' },
            { name: 'Harbor District', distance: '12 miles', opportunities: 'Engineering Programs, Community Outreach' }
        ];
        displayPortResults(mockResults);
    }, 1500);
}

function findPortsByCoordinates(lat, lng) {
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        const mockResults = [
            { name: 'Nearest Port Community', distance: '3 miles', opportunities: 'STEAM Education, Maritime Training' },
            { name: 'Regional Harbor', distance: '8 miles', opportunities: 'Engineering Programs, Community Outreach' }
        ];
        displayPortResults(mockResults);
    }, 1500);
}

function displayPortResults(results) {
    const resultsContainer = document.getElementById('port-results');
    if (!resultsContainer) return;
    
    let html = '<div class="port-list">';
    results.forEach(port => {
        html += `
            <div class="port-item">
                <h4>${port.name}</h4>
                <p><strong>Distance:</strong> ${port.distance}</p>
                <p><strong>Opportunities:</strong> ${port.opportunities}</p>
            </div>
        `;
    });
    html += '</div>';
    
    resultsContainer.innerHTML = html;
}

// Donation functions
function selectAmount(amount) {
    selectedDonationAmount = amount;
    document.querySelectorAll('.btn-donation').forEach(btn => {
        btn.style.background = 'rgba(212, 175, 55, 0.2)';
        btn.style.color = '#d4af37';
    });
    event.target.style.background = '#d4af37';
    event.target.style.color = '#1a1a1a';
}

function processDonation() {
    const customAmount = document.getElementById('custom-amount').value;
    const amount = customAmount ? parseFloat(customAmount) : selectedDonationAmount;
    
    if (!amount || amount < 1) {
        showMessage('Please select or enter a valid donation amount.', 'error');
        return;
    }
    
    if (!validateDonationAmount(amount)) {
        showMessage('Please enter a valid donation amount between $1 and $10,000.', 'error');
        return;
    }
    
    // Rate limiting
    if (isRateLimited('donation', 3, 60000)) {
        showMessage('Please wait before making another donation.', 'warning');
        return;
    }
    
    showLoading('Processing donation...');
    
    // Simulate donation processing
    setTimeout(() => {
        hideLoading();
        showMessage(`Thank you for your $${amount} donation! Your support helps fund education abroad to bring back valuable insights for America's future.`, 'success');
        closeDonationModal();
        
        // Reset donation form
        selectedDonationAmount = 0;
        document.getElementById('custom-amount').value = '';
        document.querySelectorAll('.btn-donation').forEach(btn => {
            btn.style.background = 'rgba(212, 175, 55, 0.2)';
            btn.style.color = '#d4af37';
        });
    }, 2000);
}

// Utility functions
function showLoading(message = 'Loading...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            messageDiv.style.background = '#28a745';
            break;
        case 'error':
            messageDiv.style.background = '#dc3545';
            break;
        case 'warning':
            messageDiv.style.background = '#ffc107';
            messageDiv.style.color = '#1a1a1a';
            break;
        default:
            messageDiv.style.background = '#17a2b8';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function trackEvent(category, action) {
    // Simple event tracking (in a real app, this would go to Google Analytics)
    console.log(`Event tracked: ${category} - ${action}`);
}

// Make functions globally available
window.openLocationModal = openLocationModal;
window.closeLocationModal = closeLocationModal;
window.openDonationModal = openDonationModal;
window.closeDonationModal = closeDonationModal;
window.getCurrentLocation = getCurrentLocation;
window.submitLocation = submitLocation;
window.selectAmount = selectAmount;
window.processDonation = processDonation;
