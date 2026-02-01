let transactions = JSON.parse(localStorage.getItem('budgetData')) || [];
let currentFilter = 'all';

const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');

function updateDashboard() {
    // 1. Calculate Totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    // 2. Update Header Cards
    document.getElementById('total-income').innerText = `$${income.toFixed(2)}`;
    document.getElementById('total-expenses').innerText = `$${expense.toFixed(2)}`;
    document.getElementById('balance').innerText = `$${balance.toFixed(2)}`;

    // 3. Update Chart Bar
    const total = income + expense;
    if (total > 0) {
        const incPerc = (income / total) * 100;
        const expPerc = (expense / total) * 100;
        document.getElementById('income-bar').style.width = incPerc + '%';
        document.getElementById('expense-bar').style.width = expPerc + '%';
        document.getElementById('inc-perc').innerText = Math.round(incPerc) + '%';
        document.getElementById('exp-perc').innerText = Math.round(expPerc) + '%';
    } else {
        
        document.getElementById('income-bar').style.width = '50%';
        document.getElementById('expense-bar').style.width = '50%';
        document.getElementById('inc-perc').innerText = '0%';
        document.getElementById('exp-perc').innerText = '0%';
    }

    // 4. Render Transaction List
    renderList();
}

function renderList() {
    list.innerHTML = '';
    
    const filtered = transactions.filter(t => {
        if (currentFilter === 'all') return true;
        return t.type === currentFilter;
    });

    if (filtered.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No transactions found.</p>';
        return;
    }

    filtered.forEach(t => {
        const li = document.createElement('li');
        li.className = `transaction-item ${t.type}`;
        li.innerHTML = `
            <span><b>${t.description}</b></span>
            <span>
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                <button class="delete-btn" onclick="removeTransaction(${t.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </span>
        `;
        list.appendChild(li);
    });
}

function setType(val) {
    document.getElementById('type').value = val;
    document.getElementById('income-option').classList.remove('active');
    document.getElementById('expense-option').classList.remove('active');

    if (val === 'income') {
        document.getElementById('income-option').classList.add('active');
    } else {
        document.getElementById('expense-option').classList.add('active');
    }
}

// Event: Add Transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTransaction = {
        id: Date.now(),
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value
    };

    transactions.unshift(newTransaction);
    saveAndRefresh();
    form.reset();
    setType('income'); 
});

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveAndRefresh();
}

function filterTransactions(cat) {
    currentFilter = cat;
    renderList();
}

function saveAndRefresh() {
    localStorage.setItem('budgetData', JSON.stringify(transactions));
    updateDashboard();
}

updateDashboard();
