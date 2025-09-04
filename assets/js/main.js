// Main JavaScript for Steam Dreams America

// Global variables
let selectedDonationAmount = 0;
const rateLimitStore = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSecurity();
    initializeAnalytics();
    initializeEmailSignup();
    initializeSocialSharing();
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
            navbar.style.background = 'rgba(44, 62, 80, 0.98)';
        } else {
            navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        }
    });
}

// Security functions
function initializeSecurity() {
    addCSRFToken();
    addInputValidation();
    preventFormResubmission();
    monitorSecurityEvents();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

function validateDonationAmount(amount) {
    const num = parseInt(amount);
    return !isNaN(num) && num > 0 && num <= 10000; // Max $10,000
}

function isRateLimited() {
    const now = Date.now();
    const key = 'donation_attempts';
    
    if (!rateLimitStore[key]) {
        rateLimitStore[key] = [];
    }
    
    // Remove attempts older than 1 hour
    rateLimitStore[key] = rateLimitStore[key].filter(time => now - time < 3600000);
    
    // Check if too many attempts
    if (rateLimitStore[key].length >= 5) {
        return true;
    }
    
    // Add current attempt
    rateLimitStore[key].push(now);
    return false;
}

function logDonationAttempt(amount, emailStatus) {
    const logData = {
        timestamp: new Date().toISOString(),
        amount: amount,
        email_provided: emailStatus,
        user_agent: navigator.userAgent.substring(0, 100),
        ip_hash: 'anonymous'
    };
    
    // Store in localStorage (for demo - in production, send to secure server)
    const logs = JSON.parse(localStorage.getItem('donation_logs') || '[]');
    logs.push(logData);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('donation_logs', JSON.stringify(logs));
}

function addCSRFToken() {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const forms = document.querySelectorAll('form, input[type="email"], input[type="text"]');
    forms.forEach(form => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = '_csrf';
        input.value = token;
        form.appendChild(input);
    });
}

function addInputValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
                this.setCustomValidity('Please enter a valid email address');
            } else {
                this.style.borderColor = '';
                this.setCustomValidity('');
            }
        });
    });
}

function preventFormResubmission() {
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
}

function monitorSecurityEvents() {
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/
    ];
    
    document.addEventListener('input', function(e) {
        const value = e.target.value;
        suspiciousPatterns.forEach(pattern => {
            if (pattern.test(value)) {
                console.log('Security Event: suspicious_input', e.target.name);
                e.target.value = sanitizeInput(value);
            }
        });
    });
}

// Analytics
function initializeAnalytics() {
    // Track page views
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'Steam Dreams America',
            page_location: window.location.href
        });
    }
    
    // Track custom events
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn')) {
            trackEvent('button_click', 'engagement', e.target.textContent);
        }
        
        if (e.target.matches('.nav-link')) {
            trackEvent('navigation', 'engagement', e.target.textContent);
        }
    });
}

function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Email signup
function initializeEmailSignup() {
    const emailForm = document.getElementById('email-signup-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email-input').value;
            const zip = document.getElementById('zip-input').value;
            
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Track the signup
            trackEvent('email_signup', 'engagement', zip || 'no_zip');
            
            // Store email (in production, send to your server)
            localStorage.setItem('steam_dreams_email', email);
            if (zip) {
                localStorage.setItem('steam_dreams_zip', zip);
            }
            
            showMessage('Thank you for subscribing! You\'ll receive updates about Steam Dreams America.', 'success');
            
            // Clear form
            document.getElementById('email-input').value = '';
            document.getElementById('zip-input').value = '';
        });
    }
}

// Social sharing
function initializeSocialSharing() {
    // Facebook sharing
    window.shareOnFacebook = function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Transform America\'s ports into opportunity engines through STEAM education. Join Steam Dreams America!');
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
        trackEvent('social_share', 'engagement', 'facebook');
    };
    
    // Twitter sharing
    window.shareOnTwitter = function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Transform America\'s ports into opportunity engines through STEAM education. Join Steam Dreams America! #SteamDreamsAmerica #AmericanRenewal');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        trackEvent('social_share', 'engagement', 'twitter');
    };
}

// Modal functions
function openLocationModal() {
    document.getElementById('locationModal').style.display = 'block';
    trackEvent('modal_open', 'engagement', 'location');
}

function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
}

function openRepFinder() {
    document.getElementById('repModal').style.display = 'block';
    trackEvent('modal_open', 'engagement', 'representatives');
}

function closeRepModal() {
    document.getElementById('repModal').style.display = 'none';
}

function openDonationModal() {
    document.getElementById('donationModal').style.display = 'block';
    trackEvent('modal_open', 'engagement', 'donation');
}

function closeDonationModal() {
    document.getElementById('donationModal').style.display = 'none';
}

// Location functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        showLoading('port-results', 'Getting your location...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                findPortsByCoordinates(lat, lng);
                trackEvent('location_used', 'engagement', 'geolocation');
            },
            function(error) {
                showMessage('Unable to get your location. Please enter your location manually.', 'error');
                trackEvent('location_error', 'engagement', error.code);
            }
        );
    } else {
        showMessage('Geolocation is not supported by this browser.', 'error');
    }
}

function submitLocation() {
    const location = document.getElementById('manual-location').value;
    if (location.trim()) {
        closeLocationModal();
        showLoading('port-results', 'Finding port communities...');
        findPortsByLocation(location);
        trackEvent('location_search', 'engagement', 'manual');
    } else {
        showMessage('Please enter a location.', 'error');
    }
}

function findPortsByLocation(location) {
    // Simulate API call to find nearby ports
    setTimeout(() => {
        const ports = getPortsByLocation(location);
        displayPortResults(ports);
    }, 1000);
}

function findPortsByCoordinates(lat, lng) {
    // Simulate API call to find nearby ports
    setTimeout(() => {
        const ports = getPortsByCoordinates(lat, lng);
        displayPortResults(ports);
    }, 1000);
}

function displayPortResults(ports) {
    const resultsDiv = document.getElementById('port-results');
    
    if (ports.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-info">No port communities found in your area. Try searching for a different location.</div>';
        return;
    }
    
    let html = '<h3>Port Communities Near You</h3>';
    ports.forEach(port => {
        html += `
            <div class="port-card">
                <h4>${port.name}</h4>
                <p>${port.description}</p>
                <div class="port-actions">
                    <button class="btn btn-small btn-contact" onclick="joinPortCommunity('${port.id}')">
                        Join Community
                    </button>
                    <button class="btn btn-small btn-email" onclick="contactPort('${port.id}')">
                        Contact Port
                    </button>
                    <button class="btn btn-small btn-call" onclick="viewPortDetails('${port.id}')">
                        View Details
                    </button>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

// Representative functions
function getRepLocation() {
    if (navigator.geolocation) {
        showLoading('rep-results', 'Finding your representatives...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                findRepresentativesByCoordinates(lat, lng);
                trackEvent('rep_search', 'engagement', 'geolocation');
            },
            function(error) {
                showMessage('Unable to get your location. Please enter your address manually.', 'error');
                trackEvent('rep_error', 'engagement', error.code);
            }
        );
    } else {
        showMessage('Geolocation is not supported by this browser.', 'error');
    }
}

function findRepresentatives() {
    const address = document.getElementById('rep-address').value;
    if (address.trim()) {
        closeRepModal();
        showLoading('rep-results', 'Finding your representatives...');
        findRepresentativesByAddress(address);
        trackEvent('rep_search', 'engagement', 'manual');
    } else {
        showMessage('Please enter your address.', 'error');
    }
}

function findRepresentativesByAddress(address) {
    // Simulate API call to find representatives
    setTimeout(() => {
        const reps = getRepresentativesByAddress(address);
        displayRepresentativeResults(reps);
    }, 1000);
}

function findRepresentativesByCoordinates(lat, lng) {
    // Simulate API call to find representatives
    setTimeout(() => {
        const reps = getRepresentativesByCoordinates(lat, lng);
        displayRepresentativeResults(reps);
    }, 1000);
}

function displayRepresentativeResults(reps) {
    const resultsDiv = document.getElementById('rep-results');
    
    if (reps.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-info">No representatives found for your location. Please try a different address.</div>';
        return;
    }
    
    let html = '<h3>Your Representatives</h3>';
    reps.forEach(rep => {
        html += `
            <div class="rep-card">
                <h4>${rep.name}</h4>
                <p><strong>Office:</strong> ${rep.office}</p>
                <p><strong>Party:</strong> ${rep.party}</p>
                <div class="rep-actions">
                    <button class="btn btn-small btn-email" onclick="emailRepresentative('${rep.id}')">
                        Email
                    </button>
                    <button class="btn btn-small btn-call" onclick="callRepresentative('${rep.id}')">
                        Call
                    </button>
                    <button class="btn btn-small btn-contact" onclick="viewRepProfile('${rep.id}')">
                        View Profile
                    </button>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

// Donation functions
function selectAmount(amount) {
    selectedDonationAmount = amount;
    
    // Update button styles
    document.querySelectorAll('.btn-donation').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    
    // Update custom amount field
    document.getElementById('custom-amount').value = amount;
}

function processDonation() {
    const customAmount = document.getElementById('custom-amount').value;
    const amount = customAmount || selectedDonationAmount;
    
    if (!validateDonationAmount(amount)) {
        showMessage('Please enter a valid donation amount between $1 and $10,000.', 'error');
        return;
    }
    
    if (isRateLimited()) {
        showMessage('Too many donation attempts. Please try again later.', 'error');
        return;
    }
    
    // Log donation attempt
    logDonationAttempt(amount, true);
    
    // Redirect to Cash App
    const cashAppUrl = `https://cash.app/$DanteNathanielFord/${amount}`;
    window.open(cashAppUrl, '_blank');
    
    trackEvent('donation_attempt', 'engagement', amount);
    closeDonationModal();
    
    showMessage('Thank you for your support! You\'ve been redirected to Cash App to complete your donation.', 'success');
}

// Utility functions
function showLoading(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }
}

function showMessage(message, type) {
    const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass}`;
    alertDiv.textContent = message;
    
    // Insert at the top of the body
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Action functions (placeholder implementations)
function joinPortCommunity(portId) {
    trackEvent('port_join', 'engagement', portId);
    showMessage('Thank you for joining the port community! You\'ll receive updates about opportunities.', 'success');
}

function contactPort(portId) {
    trackEvent('port_contact', 'engagement', portId);
    showMessage('Port contact information has been sent to your email.', 'success');
}

function viewPortDetails(portId) {
    trackEvent('port_details', 'engagement', portId);
    showMessage('Port details page will be available soon.', 'info');
}

function emailRepresentative(repId) {
    trackEvent('rep_email', 'engagement', repId);
    showMessage('Email template has been prepared. Please check your email client.', 'success');
}

function callRepresentative(repId) {
    trackEvent('rep_call', 'engagement', repId);
    showMessage('Phone number has been copied to your clipboard.', 'success');
}

function viewRepProfile(repId) {
    trackEvent('rep_profile', 'engagement', repId);
    showMessage('Representative profile will be available soon.', 'info');
}
