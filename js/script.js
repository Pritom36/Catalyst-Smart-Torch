// Constants
const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let totalPages = 1;

// Model questions data
const modelQuestions = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Model Question ${i + 1}`,
    description: `Comprehensive practice questions and detailed solutions for exam preparation`,
    image: `images/question-${i + 1}.jpg`,
    date: new Date(2025, 4, i + 1).toLocaleDateString(),
    difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
    isLocked: i + 1 > 2 // Lock all questions except 1 and 2
}));

// Initialize questions grid
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                navMenu.classList.remove('show');
            }
        });
    });
    
    // Header Scroll Effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    loadQuestions();
    setupPagination();
    setupSearch();
});

// Load questions
function loadQuestions(filteredQuestions = modelQuestions) {
    const container = document.getElementById('questions-container');
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageQuestions = filteredQuestions.slice(start, end);

    container.innerHTML = '';

    pageQuestions.forEach(question => {
        const isAccessible = !question.isLocked || isSubscribed();
        const card = document.createElement('div');
        card.className = `question-card${question.isLocked && !isSubscribed() ? ' locked' : ''}`;
        
        card.innerHTML = `
            <a href="${isAccessible ? `model-questions/model-${question.id}.html` : '#'}" 
               ${!isAccessible ? 'onclick="handleLockedQuestion(event)"' : ''}>
                <div class="question-image">
                    <img src="${question.image}" alt="${question.title}" onerror="this.src='images/default-question.jpg'">
                    ${question.isLocked && !isSubscribed() ? '<div class="lock-icon"><i class="fas fa-lock"></i></div>' : ''}
                </div>
                <div class="question-content">
                    <h3>${question.title}</h3>
                    <div class="question-meta">
                        <span><i class="far fa-calendar"></i> ${question.date}</span>
                        <span><i class="fas fa-signal"></i> ${question.difficulty}</span>
                    </div>
                    <p class="question-desc">${question.description}</p>
                    <button class="view-btn">
                        ${isAccessible ? 'View Question' : 'Subscribe to Access'}
                    </button>
                </div>
            </a>
        `;
        
        container.appendChild(card);
    });
}

// Handle locked question click
function handleLockedQuestion(event) {
    event.preventDefault();
    const username = localStorage.getItem('username');
    
    if (username) {
        // User is logged in but subscription expired
        window.location.href = 'profile.html';
    } else {
        // User is not logged in
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
}

// Check if user is subscribed
function isSubscribed() {
    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');
    const expiryDate = localStorage.getItem('expiryDate');
    
    if (!username || !accessToken || !expiryDate) {
        return false;
    }

    // Check if subscription is expired
    if (new Date(expiryDate) <= new Date()) {
        return false;
    }

    // Validate session token
    try {
        const decoded = atob(accessToken);
        const [storedUsername, timestamp] = decoded.split(':');
        const tokenAge = new Date().getTime() - parseInt(timestamp);
        return tokenAge <= 24 * 60 * 60 * 1000 && storedUsername === username;
    } catch {
        return false;
    }
}

// Setup pagination
function setupPagination() {
    const totalItems = modelQuestions.length;
    totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const pageNumbers = document.getElementById('page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.className = `page-number${i === currentPage ? ' active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.onclick = () => {
            currentPage = i;
            loadQuestions();
            updatePaginationUI();
        };
        pageNumbers.appendChild(pageNumber);
    }
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Update pagination UI
function updatePaginationUI() {
    document.querySelectorAll('.page-number').forEach((btn, idx) => {
        btn.classList.toggle('active', idx + 1 === currentPage);
    });
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Setup search functionality
function setupSearch() {
    const searchBox = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');
    
    function performSearch() {
        const query = searchBox.value.toLowerCase();
        const filteredQuestions = modelQuestions.filter(q => 
            q.title.toLowerCase().includes(query) || 
            q.description.toLowerCase().includes(query)
        );
        
        currentPage = 1;
        loadQuestions(filteredQuestions);
        setupPagination();
    }
    
    searchBox.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    searchBtn.addEventListener('click', performSearch);
}

// Navigation event listeners
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadQuestions();
        updatePaginationUI();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadQuestions();
        updatePaginationUI();
    }
});

// Login Modal Functionality
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');

function showLoginModal() {
    loginModal.classList.add('show');
}

// Close modal when clicking outside
loginModal.addEventListener('click', function(e) {
    if (e.target === loginModal) {
        loginModal.classList.remove('show');
    }
});

// Handle login form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const pin = document.getElementById('secretPin').value;
    
    const isValid = await SubscriptionSystem.validateCredentials(username, pin);
    if (isValid) {
        loginModal.classList.remove('show');
        loadQuestions();
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// User profile link
const profileLink = document.createElement('li');
profileLink.innerHTML = '<a href="#" id="profileLink">Profile</a>';
navMenu.appendChild(profileLink);

document.getElementById('profileLink').addEventListener('click', async function(e) {
    e.preventDefault();
    if (!SubscriptionSystem.isLoggedIn()) {
        showLoginModal();
        return;
    }
    
    const profile = await SubscriptionSystem.getUserProfile();
    if (profile) {
        // Show profile information in a modal
        const profileHtml = `
            <h2>Your Profile</h2>
            <p><strong>Username:</strong> ${profile.username}</p>
            <p><strong>Subscription Type:</strong> ${profile.subscription_type}</p>
            <p><strong>Start Date:</strong> ${new Date(profile.start_date).toLocaleDateString()}</p>
            <p><strong>Expiry Date:</strong> ${new Date(profile.expiry_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${new Date(profile.expiry_date) > new Date() ? 'Active' : 'Expired'}</p>
            <button onclick="SubscriptionSystem.logout(); window.location.reload();">Logout</button>
        `;
        // You can create a modal to show this information
        alert(profileHtml); // Temporary solution, replace with proper modal
    }
});

// Handle session cleanup on page unload
window.addEventListener('beforeunload', function() {
    // Clear session storage (temporary data)
    sessionStorage.clear();
    
    // Clear login-related localStorage items
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiryDate');
});

// Handle session cleanup when tab/window closes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // Clear session storage (temporary data)
        sessionStorage.clear();
        
        // Clear login-related localStorage items
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiryDate');
    }
});

