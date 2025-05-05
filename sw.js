// Service Worker for offline access
const CACHE_VERSION = '1.0';
const CACHE_NAME = 'model-questions-cache';

// Resources to cache immediately on install
const PRECACHE_RESOURCES = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/js/subscription.js',
    '/js/protection.js',
    '/js/themes.js',
    '/js/cache.js',
    '/js/security.js'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_RESOURCES);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('model-questions-') &&
                           cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Handle model question requests
    if (requestUrl.pathname.startsWith('/model-questions/')) {
        event.respondWith(handleModelQuestionRequest(event.request));
    } else {
        // For other requests, try network first, then cache
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache successful responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // If network fails, try cache
                    return caches.match(event.request);
                })
        );
    }
});

// Handle model question requests
async function handleModelQuestionRequest(request) {
    // Try network first
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
            return response;
        }
    } catch (error) {
        console.log('Network request failed, trying cache:', error);
    }

    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // If neither works, return an offline page
    return new Response(
        `<!DOCTYPE html>
        <html>
            <head>
                <title>Offline - Model Questions</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #f5f5f5;
                    }
                    .offline-message {
                        text-align: center;
                        padding: 20px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 { color: #1a3a8f; }
                    p { color: #666; }
                    .btn {
                        display: inline-block;
                        padding: 10px 20px;
                        background: #1a3a8f;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="offline-message">
                    <h1>You're Offline</h1>
                    <p>This model question hasn't been cached for offline access.</p>
                    <a href="/" class="btn">Return Home</a>
                </div>
            </body>
        </html>`,
        {
            headers: { 'Content-Type': 'text/html' }
        }
    );
}

// Listen for messages from the main thread
self.addEventListener('message', event => {
    if (event.data.type === 'CACHE_MODEL_QUESTION') {
        const { modelNumber } = event.data;
        event.waitUntil(
            cacheModelQuestion(modelNumber)
        );
    }
});

// Cache a specific model question and its resources
async function cacheModelQuestion(modelNumber) {
    const resources = [
        `/model-questions/model-${modelNumber}.html`,
        '/js/protection.js',
        '/js/subscription.js',
        '/js/themes.js',
        '/css/style.css',
        `/images/question-${modelNumber}.jpg`
    ];

    const cache = await caches.open(CACHE_NAME);
    
    // Cache each resource
    await Promise.all(resources.map(async resource => {
        try {
            const response = await fetch(resource);
            if (response.ok) {
                await cache.put(resource, response);
            }
        } catch (error) {
            console.error(`Failed to cache ${resource}:`, error);
        }
    }));
};