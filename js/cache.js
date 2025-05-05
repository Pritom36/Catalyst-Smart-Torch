// Cache manager for offline access
const CacheManager = {
    // Cache configuration
    CONFIG: {
        version: '1.0',
        cacheName: 'model-questions-cache',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxSize: 50 * 1024 * 1024 // 50MB
    },

    // Initialize cache
    async init() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    },

    // Cache a model question for offline access
    async cacheModelQuestion(modelNumber) {
        if (!this.isStorageAvailable()) {
            throw new Error('Storage not available');
        }

        const username = localStorage.getItem('username');
        const accessToken = localStorage.getItem('accessToken');
        
        if (!username || !accessToken) {
            throw new Error('Not authenticated');
        }

        try {
            // Cache the main HTML
            const htmlUrl = `/model-questions/model-${modelNumber}.html`;
            const htmlResponse = await fetch(htmlUrl);
            const cache = await caches.open(this.CONFIG.cacheName);
            await cache.put(htmlUrl, htmlResponse.clone());

            // Cache associated resources (images, scripts, styles)
            const resources = [
                '/js/protection.js',
                '/js/subscription.js',
                '/js/themes.js',
                '/css/style.css',
                `/images/question-${modelNumber}.jpg`
            ];

            await Promise.all(resources.map(async (url) => {
                try {
                    const response = await fetch(url);
                    await cache.put(url, response);
                } catch (error) {
                    console.warn(`Failed to cache resource: ${url}`, error);
                }
            }));

            // Store cache metadata
            const metadata = {
                modelNumber,
                timestamp: Date.now(),
                username,
                expiryDate: localStorage.getItem('expiryDate')
            };

            await this.storeMetadata(modelNumber, metadata);
            return true;
        } catch (error) {
            console.error('Failed to cache model question:', error);
            throw error;
        }
    },

    // Check if a model question is available offline
    async isAvailableOffline(modelNumber) {
        if (!this.isStorageAvailable()) {
            return false;
        }

        try {
            const cache = await caches.open(this.CONFIG.cacheName);
            const response = await cache.match(`/model-questions/model-${modelNumber}.html`);
            
            if (!response) {
                return false;
            }

            // Check metadata
            const metadata = await this.getMetadata(modelNumber);
            if (!metadata) {
                return false;
            }

            // Check if cache is still valid
            const now = Date.now();
            const isExpired = now - metadata.timestamp > this.CONFIG.maxAge;
            const isSubscriptionExpired = new Date(metadata.expiryDate) <= new Date();

            return !isExpired && !isSubscriptionExpired;
        } catch {
            return false;
        }
    },

    // Remove cached content
    async clearCache(modelNumber = null) {
        try {
            if (modelNumber) {
                // Clear specific model question
                const cache = await caches.open(this.CONFIG.cacheName);
                await cache.delete(`/model-questions/model-${modelNumber}.html`);
                await this.deleteMetadata(modelNumber);
            } else {
                // Clear all cached content
                await caches.delete(this.CONFIG.cacheName);
                await this.clearAllMetadata();
            }
            return true;
        } catch (error) {
            console.error('Failed to clear cache:', error);
            throw error;
        }
    },

    // Store cache metadata
    async storeMetadata(modelNumber, metadata) {
        const key = `cache_metadata_${modelNumber}`;
        try {
            const encryptedData = await Security.encryptData(
                metadata,
                localStorage.getItem('accessToken')
            );
            localStorage.setItem(key, encryptedData);
        } catch (error) {
            console.error('Failed to store cache metadata:', error);
            throw error;
        }
    },

    // Get cache metadata
    async getMetadata(modelNumber) {
        const key = `cache_metadata_${modelNumber}`;
        try {
            const encryptedData = localStorage.getItem(key);
            if (!encryptedData) {
                return null;
            }
            return await Security.decryptData(
                encryptedData,
                localStorage.getItem('accessToken')
            );
        } catch {
            return null;
        }
    },

    // Delete cache metadata
    async deleteMetadata(modelNumber) {
        const key = `cache_metadata_${modelNumber}`;
        localStorage.removeItem(key);
    },

    // Clear all metadata
    async clearAllMetadata() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('cache_metadata_')) {
                localStorage.removeItem(key);
            }
        });
    },

    // Check if storage is available
    isStorageAvailable() {
        try {
            const storage = window.localStorage;
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Get cache storage usage
    async getCacheUsage() {
        try {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentage: Math.round((estimate.usage / estimate.quota) * 100)
            };
        } catch {
            return null;
        }
    }
};