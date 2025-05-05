let transactions = [];

document.getElementById('transaction-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!description || isNaN(amount) || !date) return;

  const transaction = {
    description,
    amount,
    category,
    date
  };

  transactions.push(transaction);
  updateUI();
  this.reset();
});

function updateUI() {
  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  let income = 0;
  let expense = 0;

  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.className = tx.amount >= 0 ? 'positive' : 'negative';
    li.innerHTML = `
      ${tx.date} - ${tx.description} (${tx.category})
      <span>${formatCurrency(tx.amount)}</span>
    `;
    list.appendChild(li);

    if (tx.amount >= 0) income += tx.amount;
    else expense += tx.amount;
  });

  const balance = income + expense;

  document.getElementById('income').innerText = formatCurrency(income);
  document.getElementById('expense').innerText = formatCurrency(Math.abs(expense));
  document.getElementById('balance').innerText = formatCurrency(balance);
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Menu toggle
function toggleMenu() {
  const menu = document.getElementById('side-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Navegação
function showMain() {
  document.getElementById('main-section').style.display = 'block';
  document.getElementById('detailed-history').style.display = 'none';
}

function showDetailedHistory() {
  document.getElementById('main-section').style.display = 'none';
  document.getElementById('detailed-history').style.display = 'block';

  const list = document.getElementById('detailed-list');
  list.innerHTML = '';

  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.innerText = `${tx.date} - ${tx.description} (${tx.category}): ${formatCurrency(tx.amount)}`;
    list.appendChild(li);
  });
}

// Exportar para CSV
document.getElementById('export-csv').addEventListener('click', () => {
  let csvContent = "data:text/csv;charset=utf-8,Data,Descrição,Valor,Categoria\n";
  transactions.forEach(tx => {
    csvContent += `${tx.date},${tx.description},${tx.amount},${tx.category}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transacoes.csv");
  document.body.appendChild(link);
  link.click();
});
