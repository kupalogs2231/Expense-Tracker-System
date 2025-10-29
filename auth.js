// auth.js - Authentication and Data Management
// This file handles user authentication and data storage
// Replace the in-memory storage with your backend API calls

// In-memory storage (replace this with backend API calls)
const users = {};
let currentUser = null;
let transactions = [];
let editingId = null;

// Initialize on page load
window.addEventListener('load', () => {
    checkAuthStatus();
    updateCurrentDate();
});

// Update current date display
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

// Check if user is already logged in
function checkAuthStatus() {
    // TODO: Replace with API call to check session/token
    // Example: fetch('/api/auth/check-session')
    showLogin();
    document.getElementById('loadingScreen').classList.add('hidden');
}

// Handle user registration
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    const errorDiv = document.getElementById('registerError');
    errorDiv.innerHTML = '';

    // Validate passwords match
    if (password !== confirmPassword) {
        errorDiv.innerHTML = '<div class="error-message">Passwords do not match</div>';
        return;
    }

    // TODO: Replace with API call to register user
    // Example API call:
    /*
    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            errorDiv.innerHTML = '<div class="success-message">Account created successfully! Please sign in.</div>';
            setTimeout(() => {
                document.getElementById('registerForm').reset();
                showLogin();
            }, 1500);
        } else {
            errorDiv.innerHTML = '<div class="error-message">' + data.message + '</div>';
        }
    })
    .catch(error => {
        errorDiv.innerHTML = '<div class="error-message">Registration failed. Please try again.</div>';
    });
    */

    // Temporary in-memory implementation (remove when connecting to backend)
    if (users[username]) {
        errorDiv.innerHTML = '<div class="error-message">Username already exists</div>';
        return;
    }

    users[username] = {
        password: password,
        transactions: [],
        createdAt: new Date().toISOString()
    };

    errorDiv.innerHTML = '<div class="success-message">Account created successfully! Please sign in.</div>';
    
    setTimeout(() => {
        document.getElementById('registerForm').reset();
        showLogin();
    }, 1500);
}

// Handle user login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    const errorDiv = document.getElementById('loginError');
    errorDiv.innerHTML = '';

    // TODO: Replace with API call to authenticate user
    // Example API call:
    /*
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = username;
            // Store token if using JWT
            // localStorage.setItem('authToken', data.token);
            loadUserData();
            document.getElementById('loginForm').reset();
            showMainApp();
        } else {
            errorDiv.innerHTML = '<div class="error-message">Invalid username or password</div>';
        }
    })
    .catch(error => {
        errorDiv.innerHTML = '<div class="error-message">Login failed. Please try again.</div>';
    });
    */

    // Temporary in-memory implementation (remove when connecting to backend)
    if (!users[username]) {
        errorDiv.innerHTML = '<div class="error-message">Invalid username or password</div>';
        return;
    }

    if (users[username].password !== password) {
        errorDiv.innerHTML = '<div class="error-message">Invalid username or password</div>';
        return;
    }

    currentUser = username;
    transactions = users[username].transactions || [];
    
    document.getElementById('loginForm').reset();
    showMainApp();
    updateDisplay();
}

// Handle user logout
function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        // TODO: Replace with API call to logout
        // Example: fetch('/api/auth/logout', { method: 'POST' })
        // Clear token: localStorage.removeItem('authToken');
        
        currentUser = null;
        transactions = [];
        showLogin();
    }
}

// Load user's transaction data
function loadUserData() {
    // TODO: Replace with API call to fetch user transactions
    // Example API call:
    /*
    fetch('/api/transactions', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
    .then(response => response.json())
    .then(data => {
        transactions = data.transactions || [];
        updateDisplay();
    })
    .catch(error => {
        console.error('Error loading data:', error);
        transactions = [];
        updateDisplay();
    });
    */

    // Temporary in-memory implementation (remove when connecting to backend)
    if (currentUser && users[currentUser]) {
        transactions = users[currentUser].transactions || [];
        updateDisplay();
    }
}

// Save user's transaction data
function saveUserData() {
    // TODO: This function is called after add/edit/delete transactions
    // Replace with API call to sync data with backend
    // Example: No need for explicit save with REST API, 
    // as each transaction operation will make its own API call
    
    // Temporary in-memory implementation (remove when connecting to backend)
    if (currentUser && users[currentUser]) {
        users[currentUser].transactions = transactions;
        updateDisplay();
    }
}

// Add new transaction
function addTransaction(transactionData) {
    // TODO: Replace with API call to create transaction
    /*
    fetch('/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify(transactionData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            transactions.push(data.transaction);
            updateDisplay();
        }
    });
    */

    // Temporary implementation
    const transaction = {
        id: Date.now(),
        ...transactionData
    };
    transactions.push(transaction);
    saveUserData();
}

// Update existing transaction
function updateTransaction(id, transactionData) {
    // TODO: Replace with API call to update transaction
    /*
    fetch('/api/transactions/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify(transactionData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const index = transactions.findIndex(t => t.id === id);
            transactions[index] = { id, ...transactionData };
            updateDisplay();
        }
    });
    */

    // Temporary implementation
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index] = { id, ...transactionData };
        saveUserData();
    }
}

// Delete transaction
function deleteTransactionById(id) {
    // TODO: Replace with API call to delete transaction
    /*
    fetch('/api/transactions/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            transactions = transactions.filter(t => t.id !== id);
            updateDisplay();
        }
    });
    */

    // Temporary implementation
    transactions = transactions.filter(t => t.id !== id);
    saveUserData();
}

// UI Functions
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('loginError').innerHTML = '';
}

function showRegister() {
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('registerError').innerHTML = '';
}

function showMainApp() {
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('sidebarUsername').textContent = currentUser;
    setDefaultDate();
    updateCurrentDate();
}

function setDefaultDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}
