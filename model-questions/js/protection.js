// Content protection code
(function() {
    // Check access before loading content
    function checkAccess() {
        const path = window.location.pathname;
        const modelMatch = path.match(/model-(\d+)\.html$/);
        
        if (modelMatch) {
            const modelNumber = parseInt(modelMatch[1]);
            
            // Model 1 and 2 are free
            if (modelNumber > 2) {
                const username = localStorage.getItem('username');
                const accessToken = localStorage.getItem('accessToken');
                const expiryDate = localStorage.getItem('expiryDate');
                
                if (!username || !accessToken || !expiryDate) {
                    redirectToLogin();
                    return;
                }

                // Check if subscription is expired
                if (new Date(expiryDate) <= new Date()) {
                    alert('Your subscription has expired. Please renew to continue accessing premium content.');
                    redirectToLogin();
                    return;
                }

                // Validate session token
                try {
                    const decoded = atob(accessToken);
                    const [storedUsername, timestamp] = decoded.split(':');
                    const tokenAge = new Date().getTime() - parseInt(timestamp);
                    
                    if (tokenAge > 24 * 60 * 60 * 1000 || storedUsername !== username) {
                        redirectToLogin();
                        return;
                    }
                } catch {
                    redirectToLogin();
                    return;
                }
            }
        }
    }

    // Redirect to login page
    function redirectToLogin() {
        const currentPath = window.location.pathname;
        window.location.href = '/login.html?redirect=' + encodeURIComponent(currentPath);
    }

    // Run access check immediately
    checkAccess();

    // Allow selection for navbar elements
    function allowSelection(element) {
        return element.closest('.navbar') || 
               element.closest('.dropdown') || 
               element.closest('.dropdown-content');
    }

    // Prevent text selection except navbar
    document.addEventListener('selectstart', function(e) {
        if (!allowSelection(e.target)) {
            e.preventDefault();
            return false;
        }
    });

    // Prevent right-click except navbar
    document.addEventListener('contextmenu', function(e) {
        if (!allowSelection(e.target)) {
            e.preventDefault();
            return false;
        }
    });

    // Prevent keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Allow theme-related actions in navbar
        if (e.target.closest('.navbar')) {
            return true;
        }
        
        // Prevent common shortcuts
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 'c' || 
             e.key === 'x' || 
             e.key === 'p' ||
             e.key === 's' ||
             (e.shiftKey && e.key === 'i') ||
             e.key === 'u' ||
             e.key === 'j' ||
             e.key === 'F12')) {
            e.preventDefault();
            return false;
        }
    });

    // Add dynamic watermark with username
    function addWatermark() {
        const username = localStorage.getItem('username');
        if (username) {
            const watermark = document.createElement('div');
            watermark.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 60px;
                color: rgba(0,0,0,0.1);
                pointer-events: none;
                z-index: 1000;
                white-space: nowrap;
            `;
            watermark.textContent = username;
            document.body.appendChild(watermark);
        }
    }

    // Add watermark on page load
    addWatermark();

    // Add subscription expiry reminder
    function addExpiryReminder() {
        const expiryDate = localStorage.getItem('expiryDate');
        if (expiryDate) {
            const remaining = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            
            if (remaining <= 7 && remaining > 0) {
                const reminder = document.createElement('div');
                reminder.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ffc107;
                    color: #000;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 1001;
                    font-size: 14px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                `;
                reminder.innerHTML = `
                    Your subscription expires in ${remaining} day${remaining > 1 ? 's' : ''}
                    <br>
                    <a href="/subscribe.html" style="color: #000; text-decoration: underline;">Renew now</a>
                `;
                document.body.appendChild(reminder);
            }
        }
    }

    // Add expiry reminder on page load
    addExpiryReminder();

    // Handle session cleanup
    window.addEventListener('beforeunload', function() {
        sessionStorage.clear();
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiryDate');
    });

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            sessionStorage.clear();
            localStorage.removeItem('username');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expiryDate');
        }
    });

    // Run access check immediately
    checkAccess();
})();