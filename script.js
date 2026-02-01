// 1. Setup Data and Short-hand for selecting elements
const $ = id => document.getElementById(id);
let txs = JSON.parse(localStorage.getItem('bd')) || [], filter = 'all';

// 2. Logic to calculate totals, update chart, and save to memory
const update = () => {
    const inc = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const total = inc + exp;

    $('total-income').innerText = `$${inc.toFixed(2)}`;
    $('total-expenses').innerText = `$${exp.toFixed(2)}`;
    $('balance').innerText = `$${(inc - exp).toFixed(2)}`;

    // Chart logic
    const per = total > 0 ? (inc / total) * 100 : 50;
    $('income-bar').style.width = per + '%';
    $('expense-bar').style.width = (100 - per) + '%';
    $('inc-perc').innerText = (total > 0 ? Math.round(per) : 0) + '%';
    $('exp-perc').innerText = (total > 0 ? Math.round(100 - per) : 0) + '%';

    localStorage.setItem('bd', JSON.stringify(txs));
    render();
};

// 3. Logic to display the list items
const render = () => {
    const list = $('transaction-list');
    const items = txs.filter(t => filter === 'all' || t.type === filter);
    list.innerHTML = items.length ? items.map(t => `
        <li class="transaction-item ${t.type}">
            <b>${t.description}</b>
            <span>${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            <button class="delete-btn" onclick="del(${t.id})"><i class="fas fa-trash-alt"></i></button></span>
        </li>`).join('') : '<p style="text-align:center; color:#999; margin-top:20px;">No items</p>';
};

// 4. Handle Type Selection (Income/Expense boxes)
const setType = v => {
    $('type').value = v;
    $('income-option').classList.toggle('active', v === 'income');
    $('expense-option').classList.toggle('active', v === 'expense');
};

// 5. Events: Add, Delete, and Filter
$('transaction-form').onsubmit = e => {
    e.preventDefault();
    txs.unshift({ id: Date.now(), description: $('description').value, amount: +$('amount').value, type: $('type').value });
    update(); e.target.reset(); setType('income');
};

const del = id => { txs = txs.filter(t => t.id !== id); update(); };
const filterTransactions = c => { filter = c; render(); };

// Run on start
update();
