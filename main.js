// DOM Elements
const addBtn = document.querySelector('.add-expence-button');
const popup = document.querySelector('.add-transaction');
const transContainer = document.querySelector('.expence-container');
const balanceEl = document.querySelector('.balance');
const incomeEl = document.querySelector('.income-amount');
const expenseEl = document.querySelector('.expence-balance');
const checkboxes = document.getElementsByName('check');

// State: Load from local storage or start empty
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// 1. Show/Hide Popup Logic
addBtn.onclick = () => { popup.style.scale = "1"; popup.style.top = "0"; };
function cancelExpencePopup() { popup.style.scale = "0"; popup.style.top = "-100%"; }

// 2. Ensure only one checkbox is checked at a time (like a radio button)
checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        checkboxes.forEach(other => { if (other !== cb) other.checked = false; });
    });
});

// 3. Add Transaction
function addTransaction() {
    const desc = document.querySelector('.transaction-input').value;
    const amount = parseFloat(document.querySelector('.transaction-amount').value);
    const type = Array.from(checkboxes).find(cb => cb.checked)?.nextElementSibling.innerText;

    if (!desc || isNaN(amount) || !type) return alert("Please fill all fields and select a type!");

    const transaction = {
        id: Date.now(),
        desc,
        amount: type === "Income" ? amount : -amount,
        type: type.toLowerCase()
    };

    transactions.push(transaction);
    updateApp();
    cancelExpencePopup();
    
    // Reset inputs
    document.querySelector('.transaction-input').value = '';
    document.querySelector('.transaction-amount').value = '';
}

// 4. Update UI and Local Storage
function updateApp() {
    // Save to storage
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Render list
    transContainer.innerHTML = '';
    let totalBalance = 0, totalIncome = 0, totalExpense = 0;

    transactions.forEach(t => {
        totalBalance += t.amount;
        if (t.amount > 0) totalIncome += t.amount; else totalExpense += t.amount;

        const div = document.createElement('div');
        div.className = `expence ${t.type}`;
        div.innerHTML = `
            <p>${t.desc}</p>
            <p class="amount">${t.amount > 0 ? '' : '-'}$${Math.abs(t.amount).toFixed(2)}</p>
            <button onclick="deleteTransaction(${t.id})"><i class="bi bi-x"></i></button>
        `;
        transContainer.appendChild(div);
    });

    // Update Header Numbers
    balanceEl.innerText = `$${totalBalance.toFixed(2)}`;
    incomeEl.innerText = `$${totalIncome.toFixed(2)}`;
    expenseEl.innerText = `-$${Math.abs(totalExpense).toFixed(2)}`;
}

// 5. Delete Item
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateApp();
}

// Initialize
updateApp();
