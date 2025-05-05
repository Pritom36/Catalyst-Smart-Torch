// Subscription system
const SubscriptionSystem = {
    // Subscription durations in days
    DURATIONS: {
        '1-month': 30,
        '3-month': 90,
        '6-year': 2190
    },

    // Subscription prices
    PRICES: {
        '1-month': 499,
        '3-month': 1299,
        '6-year': 4999
    },

    // WhatsApp configuration
    WHATSAPP_CONFIG: {
        adminNumber: '1234567890', // Replace with actual admin number
        messagePrefix: 'Hello! I would like to ',
    },

    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('username') && localStorage.getItem('accessToken');
    },

    // Check if subscription is active
    async isSubscriptionActive() {
        const username = localStorage.getItem('username');
        if (!username) return false;

        try {
            const response = await fetch('/data/users.json');
            const data = await response.json();
            const user = data.users.find(u => u.username === username);
            
            if (!user) return false;

            const expiryDate = new Date(user.expiry_date);
            return expiryDate > new Date();
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    },

    // Handle new subscription request via WhatsApp
    handleSubscription(subscriptionType) {
        const message = this.formatSubscriptionMessage(subscriptionType);
        window.open(this.getWhatsAppLink(message), '_blank');
    },

    // Format WhatsApp message for subscription
    formatSubscriptionMessage(subscriptionType) {
        return `${this.WHATSAPP_CONFIG.messagePrefix}subscribe for ${subscriptionType.replace('-', ' ')} plan (৳${this.PRICES[subscriptionType]}).`;
    },

    // Get WhatsApp link with message
    getWhatsAppLink(message) {
        return `https://wa.me/${this.WHATSAPP_CONFIG.adminNumber}?text=${encodeURIComponent(message)}`;
    },

    // Validate user credentials
    async validateCredentials(username, pin) {
        try {
            const response = await fetch('/data/users.json');
            const data = await response.json();
            const user = data.users.find(u => u.username === username && u.pin === pin);
            
            if (user) {
                const expiryDate = new Date(user.expiry_date);
                if (expiryDate > new Date()) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('accessToken', btoa(username + ':' + new Date().getTime()));
                    localStorage.setItem('expiryDate', user.expiry_date);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error validating credentials:', error);
            return false;
        }
    },

    // Get user profile data
    async getUserProfile() {
        const username = localStorage.getItem('username');
        if (!username) return null;

        try {
            const response = await fetch('/data/users.json');
            const data = await response.json();
            return data.users.find(u => u.username === username);
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    },

    // Log out user
    logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiryDate');
        window.location.href = 'index.html';
    },

    // Open WhatsApp support chat
    openSupportChat(subject = '') {
        const message = `${this.WHATSAPP_CONFIG.messagePrefix}get support${subject ? ' regarding ' + subject : ''}.`;
        window.open(this.getWhatsAppLink(message), '_blank');
    },

    // Request subscription renewal
    requestRenewal(username) {
        const message = `${this.WHATSAPP_CONFIG.messagePrefix}renew my subscription (Username: ${username}).`;
        window.open(this.getWhatsAppLink(message), '_blank');
    },

    // Check subscription expiry periodically
    startExpiryCheck() {
        const checkExpiry = async () => {
            if (this.isLoggedIn()) {
                const isActive = await this.isSubscriptionActive();
                if (!isActive) {
                    alert('Your subscription has expired. Please renew to continue accessing premium content.');
                    this.logout();
                }
            }
        };

        // Check every hour
        setInterval(checkExpiry, 3600000);
        // Also check immediately
        checkExpiry();
    }
};