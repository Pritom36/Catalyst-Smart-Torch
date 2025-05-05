// Security utilities for subscription system
const Security = {
    // Generate a secure token using Web Crypto API
    async generateToken(username, expiryDate) {
        const data = `${username}:${expiryDate}:${new Date().getTime()}`;
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        
        // Generate a random salt
        const salt = crypto.getRandomValues(new Uint8Array(16));
        
        // Hash the data with salt
        const hashBuffer = await crypto.subtle.digest('SHA-256', 
            new Uint8Array([...salt, ...encodedData])
        );
        
        // Convert hash to base64
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashBase64 = btoa(String.fromCharCode(...hashArray));
        
        // Combine salt and hash
        const saltBase64 = btoa(String.fromCharCode(...salt));
        return `${saltBase64}.${hashBase64}`;
    },

    // Verify a token's authenticity
    async verifyToken(token, username, expiryDate) {
        try {
            const [saltBase64, hashBase64] = token.split('.');
            const salt = new Uint8Array(
                atob(saltBase64).split('').map(c => c.charCodeAt(0))
            );
            
            // Recreate the original data
            const data = `${username}:${expiryDate}:${new Date().getTime()}`;
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(data);
            
            // Hash the data with the extracted salt
            const verifyHashBuffer = await crypto.subtle.digest('SHA-256',
                new Uint8Array([...salt, ...encodedData])
            );
            
            const verifyHashBase64 = btoa(
                String.fromCharCode(...new Uint8Array(verifyHashBuffer))
            );
            
            return hashBase64 === verifyHashBase64;
        } catch {
            return false;
        }
    },

    // Encrypt sensitive data
    async encryptData(data, key) {
        try {
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(JSON.stringify(data));
            
            // Generate a random IV
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            // Import the key
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                encoder.encode(key),
                { name: 'AES-GCM' },
                false,
                ['encrypt']
            );
            
            // Encrypt the data
            const encryptedData = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                cryptoKey,
                encodedData
            );
            
            // Combine IV and encrypted data
            return btoa(
                String.fromCharCode(
                    ...new Uint8Array([...iv, ...new Uint8Array(encryptedData)])
                )
            );
        } catch {
            return null;
        }
    },

    // Decrypt sensitive data
    async decryptData(encryptedData, key) {
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            
            // Convert from base64
            const combined = new Uint8Array(
                atob(encryptedData).split('').map(c => c.charCodeAt(0))
            );
            
            // Extract IV and data
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            
            // Import the key
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                encoder.encode(key),
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );
            
            // Decrypt the data
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                cryptoKey,
                data
            );
            
            // Parse the decrypted data
            return JSON.parse(decoder.decode(decryptedBuffer));
        } catch {
            return null;
        }
    },

    // Generate a secure random PIN
    generatePIN() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return (array[0] % 900000 + 100000).toString();
    },

    // Hash a PIN for storage
    async hashPIN(pin) {
        const encoder = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        
        // Hash the PIN with salt
        const hashBuffer = await crypto.subtle.digest('SHA-256',
            new Uint8Array([...salt, ...encoder.encode(pin)])
        );
        
        // Convert to base64
        const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
        const saltBase64 = btoa(String.fromCharCode(...salt));
        
        return `${saltBase64}.${hashBase64}`;
    },

    // Verify a PIN against its hash
    async verifyPIN(pin, storedHash) {
        try {
            const [saltBase64, hashBase64] = storedHash.split('.');
            const salt = new Uint8Array(
                atob(saltBase64).split('').map(c => c.charCodeAt(0))
            );
            
            const encoder = new TextEncoder();
            const hashBuffer = await crypto.subtle.digest('SHA-256',
                new Uint8Array([...salt, ...encoder.encode(pin)])
            );
            
            const verifyHashBase64 = btoa(
                String.fromCharCode(...new Uint8Array(hashBuffer))
            );
            
            return hashBase64 === verifyHashBase64;
        } catch {
            return false;
        }
    }
};