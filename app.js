// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseAmount = document.getElementById('expense-amount');
const expenseDescription = document.getElementById('expense-description');
const expenseDate = document.getElementById('expense-date');
const expenseCategory = document.getElementById('expense-category');
const billUpload = document.getElementById('bill-upload');
const expensesList = document.getElementById('expenses-list');
const totalExpensesEl = document.getElementById('total-expenses');
const monthExpensesEl = document.getElementById('month-expenses');
const topCategoryEl = document.getElementById('top-category');
const searchExpenses = document.getElementById('search-expenses');
const filterCategory = document.getElementById('filter-category');
const aiInsightsContainer = document.getElementById('ai-insights-container');
const categoryChart = document.getElementById('category-chart').getContext('2d');
const trendChart = document.getElementById('trend-chart').getContext('2d');

// Set default date to today
expenseDate.valueAsDate = new Date();

// Initialize expenses array from localStorage or empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Initialize charts
let categoryChartInstance = null;
let trendChartInstance = null;

// Initialize the application
function init() {
    renderExpenses();
    updateSummary();
    updateCharts();
    generateAIInsights();
}

// Event Listeners
expenseForm.addEventListener('submit', addExpense);
searchExpenses.addEventListener('input', renderExpenses);
filterCategory.addEventListener('change', renderExpenses);

// Add new expense
async function addExpense(e) {
    e.preventDefault();
    
    // Get form values
    const amount = parseFloat(expenseAmount.value);
    const description = expenseDescription.value;
    const date = expenseDate.value;
    let category = expenseCategory.value;
    const receiptImage = billUpload.files[0];
    
    // Process receipt image if uploaded
    let receiptText = null;
    if (receiptImage) {
        receiptText = await processReceiptImage(receiptImage);
    }
    
    // If category is not selected, use AI to categorize
    if (!category) {
        category = await aiCategorize(description, amount, receiptText);
    }
    
    // Create new expense object
    const newExpense = {
        id: Date.now().toString(),
        amount,
        description,
        date,
        category,
        timestamp: new Date().toISOString()
    };
    
    // Add to expenses array
    expenses.unshift(newExpense);
    
    // Save to localStorage
    saveExpenses();
    
    // Reset form
    expenseForm.reset();
    expenseDate.valueAsDate = new Date();
    
    // Update UI
    renderExpenses();
    updateSummary();
    updateCharts();
    generateAIInsights();
    
    // Show success message
    showNotification('Expense added successfully!', 'success');
}

// Simulate AI categorization (in a real app, this would call an AI API)
async function aiCategorize(description, amount, receiptText) {
    // This is a simplified simulation of AI categorization
    // In a real application, you would call an AI service API
    
    // Convert description to lowercase for easier matching
    const text = description.toLowerCase();
    
    // Simple keyword matching for demonstration
    if (text.includes('grocery') || text.includes('food') || text.includes('restaurant') || 
        text.includes('meal') || text.includes('lunch') || text.includes('dinner') || 
        text.includes('breakfast')) {
        return 'Food';
    } else if (text.includes('uber') || text.includes('lyft') || text.includes('taxi') || 
               text.includes('bus') || text.includes('train') || text.includes('gas') || 
               text.includes('fuel') || text.includes('car')) {
        return 'Transportation';
    } else if (text.includes('rent') || text.includes('mortgage') || text.includes('housing')) {
        return 'Housing';
    } else if (text.includes('electric') || text.includes('water') || text.includes('utility') || 
               text.includes('internet') || text.includes('phone') || text.includes('bill')) {
        return 'Utilities';
    } else if (text.includes('movie') || text.includes('game') || text.includes('entertainment') || 
               text.includes('concert') || text.includes('show') || text.includes('subscription')) {
        return 'Entertainment';
    } else if (text.includes('doctor') || text.includes('hospital') || text.includes('medicine') || 
               text.includes('medical') || text.includes('health') || text.includes('pharmacy')) {
        return 'Healthcare';
    } else if (text.includes('clothes') || text.includes('shopping') || text.includes('amazon') || 
               text.includes('store') || text.includes('buy') || text.includes('purchase')) {
        return 'Shopping';
    } else if (text.includes('tuition') || text.includes('school') || text.includes('book') || 
               text.includes('course') || text.includes('class') || text.includes('education')) {
        return 'Education';
    } else {
        return 'Other';
    }
}

// Simulate receipt image processing (in a real app, this would use OCR and AI)
async function processReceiptImage(imageFile) {
    // This is a placeholder for receipt processing functionality
    // In a real application, you would use OCR and AI services
    // to extract text and information from the receipt image
    
    // For demonstration, we'll just return a success message
    // and simulate a delay to mimic processing time
    return new Promise(resolve => {
        setTimeout(() => {
            showNotification('Receipt processed successfully!', 'success');
            resolve('Receipt processed');
        }, 1000);
    });
}

// Render expenses list with filtering
function renderExpenses() {
    // Get filter values
    const searchTerm = searchExpenses.value.toLowerCase();
    const categoryFilter = filterCategory.value;
    
    // Filter expenses
    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === '' || expense.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    // Clear expenses list
    expensesList.innerHTML = '';
    
    // Check if there are any expenses
    if (filteredExpenses.length === 0) {
        expensesList.innerHTML = `
            <tr>
                <td colspan="5" class="no-expenses">No expenses found. Add some expenses to get started!</td>
            </tr>
        `;
        return;
    }
    
    // Render each expense
    filteredExpenses.forEach(expense => {
        const tr = document.createElement('tr');
        tr.classList.add('fade-in');
        tr.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${expense.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${expense.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // Add event listeners for edit and delete buttons
        const editBtn = tr.querySelector('.edit-btn');
        const deleteBtn = tr.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => editExpense(expense.id));
        deleteBtn.addEventListener('click', () => deleteExpense(expense.id));
        
        expensesList.appendChild(tr);
    });
}

// Edit expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    
    if (expense) {
        // Fill form with expense data
        expenseAmount.value = expense.amount;
        expenseDescription.value = expense.description;
        expenseDate.value = expense.date;
        expenseCategory.value = expense.category;
        
        // Remove the expense from the array
        deleteExpense(id, false);
        
        // Scroll to form
        expenseForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete expense
function deleteExpense(id, updateUI = true) {
    expenses = expenses.filter(expense => expense.id !== id);
    
    // Save to localStorage
    saveExpenses();
    
    if (updateUI) {
        // Update UI
        renderExpenses();
        updateSummary();
        updateCharts();
        generateAIInsights();
        
        // Show success message
        showNotification('Expense deleted successfully!', 'success');
    }
}

// Update summary information
function updateSummary() {
    // Calculate total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpensesEl.textContent = `$${total.toFixed(2)}`;
    
    // Calculate this month's expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTotal = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            return sum + expense.amount;
        }
        return sum;
    }, 0);
    
    monthExpensesEl.textContent = `$${monthlyTotal.toFixed(2)}`;
    
    // Find top category
    const categories = {};
    expenses.forEach(expense => {
        if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
        } else {
            categories[expense.category] = expense.amount;
        }
    });
    
    let topCategory = 'N/A';
    let topAmount = 0;
    
    for (const category in categories) {
        if (categories[category] > topAmount) {
            topAmount = categories[category];
            topCategory = category;
        }
    }
    
    topCategoryEl.textContent = topCategory;
}

// Update charts
function updateCharts() {
    updateCategoryChart();
    updateTrendChart();
}

// Update category chart
function updateCategoryChart() {
    // Calculate category totals
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals[expense.category] = expense.amount;
        }
    });
    
    // Prepare data for chart
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    // Define colors for categories
    const backgroundColors = [
        '#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7',
        '#3f37c9', '#4895ef', '#560bad', '#f15bb5', '#fee440'
    ];
    
    // Destroy previous chart if it exists
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }
    
    // Create new chart
    categoryChartInstance = new Chart(categoryChart, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Expenses by Category',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Update trend chart
function updateTrendChart() {
    // Get last 6 months of data
    const months = [];
    const monthlyTotals = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const monthName = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const monthLabel = `${monthName} ${year}`;
        
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthTotal = expenses.reduce((sum, expense) => {
            const expenseDate = new Date(expense.date);
            if (expenseDate >= monthStart && expenseDate <= monthEnd) {
                return sum + expense.amount;
            }
            return sum;
        }, 0);
        
        months.push(monthLabel);
        monthlyTotals.push(monthTotal);
    }
    
    // Destroy previous chart if it exists
    if (trendChartInstance) {
        trendChartInstance.destroy();
    }
    
    // Create new chart
    trendChartInstance = new Chart(trendChart, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyTotals,
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Spending Trend',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Generate AI insights
function generateAIInsights() {
    // Clear previous insights
    aiInsightsContainer.innerHTML = '';
    
    // Check if there are enough expenses for insights
    if (expenses.length < 3) {
        aiInsightsContainer.innerHTML = `
            <p class="no-insights">Add at least 3 expenses to get AI-powered insights about your spending habits.</p>
        `;
        return;
    }
    
    // Calculate insights
    const insights = [];
    
    // 1. Top spending category
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals[expense.category] = expense.amount;
        }
    });
    
    let topCategory = '';
    let topAmount = 0;
    
    for (const category in categoryTotals) {
        if (categoryTotals[category] > topAmount) {
            topAmount = categoryTotals[category];
            topCategory = category;
        }
    }
    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const topCategoryPercentage = ((topAmount / totalSpent) * 100).toFixed(1);
    
    insights.push({
        title: 'Top Spending Category',
        content: `Your highest spending category is <strong>${topCategory}</strong>, accounting for <strong>${topCategoryPercentage}%</strong> of your total expenses.`
    });
    
    // 2. Monthly trend
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthTotal = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            return sum + expense.amount;
        }
        return sum;
    }, 0);
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthTotal = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear) {
            return sum + expense.amount;
        }
        return sum;
    }, 0);
    
    if (lastMonthTotal > 0) {
        const percentChange = (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1);
        const trend = thisMonthTotal > lastMonthTotal ? 'up' : 'down';
        
        insights.push({
            title: 'Monthly Spending Trend',
            content: `Your spending is <strong>${trend} ${Math.abs(percentChange)}%</strong> compared to last month.`
        });
    }
    
    // 3. Unusual expenses
    const categoryAverages = {};
    Object.keys(categoryTotals).forEach(category => {
        const categoryExpenses = expenses.filter(expense => expense.category === category);
        categoryAverages[category] = categoryTotals[category] / categoryExpenses.length;
    });
    
    const unusualExpenses = expenses.filter(expense => {
        return expense.amount > categoryAverages[expense.category] * 2;
    }).slice(0, 3);
    
    if (unusualExpenses.length > 0) {
        let unusualContent = 'You have some unusually high expenses: ';
        unusualContent += unusualExpenses.map(expense => 
            `<strong>$${expense.amount.toFixed(2)}</strong> for ${expense.description} on ${formatDate(expense.date)}`
        ).join(', ');
        
        insights.push({
            title: 'Unusual Expenses Detected',
            content: unusualContent
        });
    }
    
    // 4. Savings opportunity
    const foodExpenses = expenses.filter(expense => expense.category === 'Food');
    const foodTotal = foodExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    if (foodTotal > totalSpent * 0.3) {
        insights.push({
            title: 'Savings Opportunity',
            content: `You're spending <strong>${((foodTotal / totalSpent) * 100).toFixed(1)}%</strong> of your budget on food. Consider meal planning to reduce expenses.`
        });
    }
    
    // 5. Weekly spending pattern
    const dayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    
    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const day = expenseDate.getDay();
        dayTotals[day] += expense.amount;
    });
    
    const highestDayIndex = dayTotals.indexOf(Math.max(...dayTotals));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    insights.push({
        title: 'Weekly Spending Pattern',
        content: `You tend to spend the most on <strong>${days[highestDayIndex]}</strong>. Being aware of this pattern might help you plan better.`
    });
    
    // Render insights
    insights.forEach(insight => {
        const insightCard = document.createElement('div');
        insightCard.classList.add('insight-card', 'fade-in');
        insightCard.innerHTML = `
            <h3>${insight.title}</h3>
            <p>${insight.content}</p>
        `;
        aiInsightsContainer.appendChild(insightCard);
    });
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add styles if not already in CSS
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
            }
            
            .notification-success {
                background-color: var(--success-color);
            }
            
            .notification-error {
                background-color: var(--danger-color);
            }
            
            .notification-warning {
                background-color: var(--warning-color);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; visibility: hidden; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the app
init();