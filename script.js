let transactions = [];

document.getElementById('transaction-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!date || !description || isNaN(amount)) return;

  const transaction = { date, description, amount, category };
  transactions.push(transaction);
  updateUI();
  this.reset();
});

function updateUI() {
  const transactionList = document.getElementById('transaction-list');
  const detailedList = document.getElementById('detailed-list');
  transactionList.innerHTML = '';
  detailedList.innerHTML = '';

  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    const li = document.createElement('li');
    li.classList.add(t.amount >= 0 ? 'positive' : 'negative');
    li.textContent = `${t.date} - ${t.description} - R$ ${t.amount.toFixed(2)} (${t.category})`;

    transactionList.appendChild(li);
    detailedList.appendChild(li.cloneNode(true));

    if (t.amount >= 0) income += t.amount;
    else expense += Math.abs(t.amount);
  });

  const balance = income - expense;
  document.getElementById('balance').textContent = `R$ ${balance.toFixed(2)}`;
  document.getElementById('income').textContent = `R$ ${income.toFixed(2)}`;
  document.getElementById('expense').textContent = `R$ ${expense.toFixed(2)}`;
}

// Alternância de menus
function toggleMenu() {
  const menu = document.getElementById('side-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function showMain() {
  document.getElementById('main-section').style.display = 'block';
  document.getElementById('detailed-history').style.display = 'none';
}

function showDetailedHistory() {
  document.getElementById('main-section').style.display = 'none';
  document.getElementById('detailed-history').style.display = 'block';
}
