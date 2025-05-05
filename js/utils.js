// Utility functions for subscription system
const Utils = {
    // Validate PIN format (6 digits)
    validatePIN(pin) {
        return /^\d{6}$/.test(pin);
    },

    // Validate username format (alphanumeric, underscore, 4-20 chars)
    validateUsername(username) {
        return /^[a-zA-Z0-9_]{4,20}$/.test(username);
    },

    // Generate a secure session token
    generateSessionToken(username) {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2);
        return btoa(`${username}:${timestamp}:${random}`);
    },

    // Validate session token
    validateSessionToken(token) {
        try {
            const decoded = atob(token);
            const [username, timestamp] = decoded.split(':');
            const tokenAge = new Date().getTime() - parseInt(timestamp);
            // Token expires after 24 hours
            return tokenAge < 24 * 60 * 60 * 1000 && username === localStorage.getItem('username');
        } catch {
            return false;
        }
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Calculate remaining days in subscription
    getRemainingDays(expiryDate) {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diff = expiry - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    },

    // Format currency
    formatCurrency(amount) {
        return '৳' + amount.toLocaleString();
    },

    // Get subscription details
    getSubscriptionDetails(type) {
        const details = {
            '1-month': {
                duration: '1 Month',
                price: 499,
                features: [
                    'Full access to all model questions',
                    'Detailed solutions',
                    '30 days access'
                ]
            },
            '3-month': {
                duration: '3 Months',
                price: 1299,
                features: [
                    'Everything in 1 month plan',
                    'Save 13% compared to monthly',
                    '90 days access'
                ]
            },
            '6-year': {
                duration: '6 Years',
                price: 4999,
                features: [
                    'Everything in 3 month plan',
                    'Lifetime access guarantee',
                    'Best long-term value'
                ]
            }
        };
        return details[type] || null;
    },

    // Encrypt sensitive data (for demo purposes)
    encrypt(data) {
        // In production, use a proper encryption library
        return btoa(JSON.stringify(data));
    },

    // Decrypt sensitive data (for demo purposes)
    decrypt(data) {
        // In production, use a proper encryption library
        try {
            return JSON.parse(atob(data));
        } catch {
            return null;
        }
    },

    // Check if a model question is accessible
    isQuestionAccessible(modelNumber) {
        // Model 1 and 2 are free
        if (modelNumber <= 2) return true;
        
        // Check subscription for other models
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('accessToken');
        return username && token && this.validateSessionToken(token);
    },

    // Handle unauthorized access
    handleUnauthorizedAccess() {
        const currentPath = window.location.pathname;
        window.location.href = `/login.html?redirect=${encodeURIComponent(currentPath)}`;
    }
};