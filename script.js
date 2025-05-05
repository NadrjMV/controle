let data = [];

function handleCSVUpload() {
  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      data = results.data.map(row => ({
        data: row.DATA,
        servico: row.SERVIÇO || row.SERVICO,
        valor: parseFloat((row.VALOR || "0").replace(/\D+/g, "")),
        valorFormatado: row.VALOR,
        estado: row.ESTADO,
        link: row.LINK,
        obs: row.OBS
      }));
      renderFilters();
      renderFolders(data);
    }
  });
}

function renderFolders(filteredData) {
  const folderList = document.getElementById("folderList");
  folderList.innerHTML = "";

  if (!filteredData.length) {
    folderList.innerHTML = "<p style='color:white;'>Nenhum resultado encontrado.</p>";
    return;
  }

  filteredData.forEach(item => {
    const div = document.createElement("div");
    div.className = "folder";
    div.onclick = () => {
      if (item.link && item.link.includes("http")) window.open(item.link, "_blank");
    };

    div.innerHTML = `
      <div class="folder-icon">📁</div>
      <div class="folder-info">
        <span><strong>${item.servico}</strong></span>
        <span>${item.data}</span>
        <span>${item.estado}</span>
        <span>${item.valorFormatado}</span>
      </div>
    `;

    folderList.appendChild(div);
  });
}

function renderFilters() {
  const estados = [...new Set(data.map(item => item.estado).filter(Boolean))];
  const servicos = [...new Set(data.map(item => item.servico).filter(Boolean))];

  const estadoSelect = document.getElementById("estadoFilter");
  const servicoSelect = document.getElementById("servicoFilter");

  estadoSelect.innerHTML = `<option value="">Todos os Estados</option>`;
  servicoSelect.innerHTML = `<option value="">Todos os Serviços</option>`;

  estados.forEach(estado => {
    estadoSelect.innerHTML += `<option value="${estado}">${estado}</option>`;
  });

  servicos.forEach(servico => {
    servicoSelect.innerHTML += `<option value="${servico}">${servico}</option>`;
  });
}

function applyFilter() {
  const estado = document.getElementById("estadoFilter").value;
  const servico = document.getElementById("servicoFilter").value;
  const boasPropostas = document.getElementById("boasPropostas").checked;

  let filtered = [...data];

  if (estado) {
    filtered = filtered.filter(item => item.estado === estado);
  }

  if (servico) {
    filtered = filtered.filter(item => item.servico === servico);
  }

  if (boasPropostas) {
    filtered = filtered.filter(item => item.valor > 1000000);
  }

  renderFolders(filtered);
}
