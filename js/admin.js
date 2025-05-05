// Admin functionality for subscription management
const AdminSystem = {
    // Read users.json
    async readUsersFile() {
        try {
            const response = await fetch('/data/users.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error reading users file:', error);
            return null;
        }
    },

    // Write to users.json
    async writeUsersFile(data) {
        try {
            const response = await fetch('/api/users.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Failed to write users data');
            }
            
            return true;
        } catch (error) {
            console.error('Error writing users file:', error);
            return false;
        }
    },

    // Generate a new subscription
    async createSubscription(username, pin, subscriptionType) {
        try {
            const usersData = await this.readUsersFile();
            if (!usersData) {
                return {
                    success: false,
                    message: 'Failed to read users data'
                };
            }

            const startDate = new Date();
            const expiryDate = new Date();
            const duration = SubscriptionSystem.DURATIONS[subscriptionType];
            expiryDate.setDate(startDate.getDate() + duration);

            const newUser = {
                username,
                pin,
                subscription_type: subscriptionType,
                start_date: startDate.toISOString().split('T')[0],
                expiry_date: expiryDate.toISOString().split('T')[0]
            };

            // Check if username already exists
            if (usersData.users.some(u => u.username === username)) {
                return {
                    success: false,
                    message: 'Username already exists'
                };
            }

            usersData.users.push(newUser);
            
            if (await this.writeUsersFile(usersData)) {
                return {
                    success: true,
                    message: 'Subscription created successfully',
                    user: newUser
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to save subscription'
                };
            }
        } catch (error) {
            console.error('Error creating subscription:', error);
            return {
                success: false,
                message: 'Failed to create subscription'
            };
        }
    },

    // Extend an existing subscription
    async extendSubscription(username, subscriptionType) {
        try {
            const usersData = await this.readUsersFile();
            if (!usersData) {
                return {
                    success: false,
                    message: 'Failed to read users data'
                };
            }

            const userIndex = usersData.users.findIndex(u => u.username === username);
            if (userIndex === -1) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            const user = usersData.users[userIndex];
            const currentExpiry = new Date(user.expiry_date);
            const duration = SubscriptionSystem.DURATIONS[subscriptionType];
            
            currentExpiry.setDate(currentExpiry.getDate() + duration);
            user.expiry_date = currentExpiry.toISOString().split('T')[0];
            user.subscription_type = subscriptionType;

            usersData.users[userIndex] = user;
            
            if (await this.writeUsersFile(usersData)) {
                return {
                    success: true,
                    message: 'Subscription extended successfully',
                    user
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to save changes'
                };
            }
        } catch (error) {
            console.error('Error extending subscription:', error);
            return {
                success: false,
                message: 'Failed to extend subscription'
            };
        }
    },

    // List all subscriptions
    async listSubscriptions() {
        try {
            const usersData = await this.readUsersFile();
            if (!usersData) {
                return {
                    success: false,
                    message: 'Failed to read users data'
                };
            }

            return {
                success: true,
                users: usersData.users
            };
        } catch (error) {
            console.error('Error listing subscriptions:', error);
            return {
                success: false,
                message: 'Failed to list subscriptions'
            };
        }
    },

    // Cancel a subscription
    async cancelSubscription(username) {
        try {
            const usersData = await this.readUsersFile();
            if (!usersData) {
                return {
                    success: false,
                    message: 'Failed to read users data'
                };
            }

            const userIndex = usersData.users.findIndex(u => u.username === username);
            if (userIndex === -1) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            usersData.users.splice(userIndex, 1);
            
            if (await this.writeUsersFile(usersData)) {
                return {
                    success: true,
                    message: 'Subscription cancelled successfully'
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to save changes'
                };
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            return {
                success: false,
                message: 'Failed to cancel subscription'
            };
        }
    },

    // Generate unique username and PIN
    generateCredentials() {
        const username = 'user_' + Math.random().toString(36).substr(2, 6);
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        return { username, pin };
    },

    // Format WhatsApp message for new subscription
    formatSubscriptionMessage(subscriptionType, credentials) {
        return `New Subscription Request%0A
Type: ${subscriptionType}%0A
Username: ${credentials.username}%0A
PIN: ${credentials.pin}%0A
Please confirm your payment to activate the subscription.`;
    }
};