// app.js - Main Application Logic
// This file handles the expense tracker functionality

// Handle transaction form submission
document.getElementById('transactionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const transactionData = {
        description,
        amount,
        type,
        category,
        date
    };

    if (editingId !== null) {
        // Update existing transaction
        updateTransaction(editingId, transactionData);
        editingId = null;
        document.querySelector('.btn-primary').textContent = 'Add Transaction';
    } else {
        // Add new transaction
        addTransaction(transactionData);
    }

    clearForm();
});

// Clear the transaction form
function clearForm() {
    document.getElementById('transactionForm').reset();
    setDefaultDate();
    editingId = null;
    document.querySelector('.btn-primary').textContent = 'Add Transaction';
}

// Edit a transaction
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        document.getElementById('description').value = transaction.description;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('type').value = transaction.type;
        document.getElementById('category').value = transaction.category;
        document.getElementById('date').value = transaction.date;
        editingId = id;
        document.querySelector('.btn-primary').textContent = 'Update Transaction';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Delete a transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransactionById(id);
    }
}

// Filter transactions based on selected filters
function filterTransactions() {
    updateDisplay();
}

// Update the display with current transaction data
function updateDisplay() {
    const filterType = document.getElementById('filterType').value;
    const filterCategory = document.getElementById('filterCategory').value;

    let filteredTransactions = transactions;

    // Apply type filter
    if (filterType !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
    }

    // Apply category filter
    if (filterCategory !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
    }

    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;

    // Update summary cards
    document.getElementById('totalBalance').textContent = formatCurrency(balance);
    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpense').textContent = formatCurrency(expense);

    // Update transaction list
    const listContainer = document.getElementById('transactionList');
    
    if (filteredTransactions.length === 0) {
        listContainer.innerHTML = '<div class="empty-state"><p>No transactions found</p></div>';
        return;
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render transaction items
    listContainer.innerHTML = filteredTransactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-description">${escapeHtml(t.description)}</div>
                <div class="transaction-meta">
                    <span class="category-badge">${escapeHtml(t.category)}</span>
                    <span>${formatDate(t.date)}</span>
                </div>
            </div>
            <div class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </div>
            <div class="transaction-actions">
                <button class="btn-icon" onclick="editTransaction(${t.id})" title="Edit">Edit</button>
                <button class="btn-icon delete" onclick="deleteTransaction(${t.id})" title="Delete">Delete</button>
            </div>
        </div>
    `).join('');
}

// Format currency with peso sign
function formatCurrency(amount) {
    return '₱' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
