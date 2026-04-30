let dados = {};
let rankingAtual = [];

fetch("dados.json")
  .then(res => res.json())
  .then(data => {
    dados = data;
    mostrarRanking("capixabas");
  });

function mostrarRanking(tipo) {
  rankingAtual = dados[tipo];

  if (tipo !== "recordes") {
    rankingAtual = [...rankingAtual];

    rankingAtual.sort((a, b) => {
      if (b.ouro !== a.ouro) return b.ouro - a.ouro;
      if (b.prata !== a.prata) return b.prata - a.prata;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      return a.nome.localeCompare(b.nome);
    });
  }

  renderizar(rankingAtual, tipo);
}

function renderizar(listaDados, tipo) {
  const container = document.getElementById("ranking");
  container.innerHTML = "";

  // 👉 Se for recordes (formato novo)
  if (tipo === "recordes") {
    Object.keys(listaDados).forEach(evento => {
      const bloco = document.createElement("div");

      bloco.innerHTML = `
        <h2 class="evento-titulo">
  <span class="cubing-icon event-${evento}"></span>
  ${traduzirEvento(evento)}
</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nome</th>
              <th>Resultado</th>
              <th>Competição</th>
              <th>Resoluções</th>
            </tr>
          </thead>
          <tbody>
            ${listaDados[evento].map(r => `
              <tr>
                <td>${r.tipo}</td>
                <td>${r.nome}</td>
                <td>${r.resultado}</td>
                <td>${r.competicao}</td>
                <td>${r.resolucoes.join(" ")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      container.appendChild(bloco);
    });

    return;
  }

  // 👉 ranking normal (medalhas)
  container.innerHTML = "<ul></ul>";
  const lista = container.querySelector("ul");

  listaDados.forEach((p, i) => {
    const item = document.createElement("li");
    item.textContent = `${i + 1}. ${p.nome} 🥇${p.ouro} 🥈${p.prata} 🥉${p.bronze}`;
    lista.appendChild(item);
  });
}

function filtrar() {
  const termo = document.getElementById("busca").value.toLowerCase();

  const filtrados = rankingAtual.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );

  renderizar(filtrados);
}

 function traduzirEvento(codigo) {
  const nomes = {
    "333": "3x3x3",
    "222": "2x2x2",
    "444": "4x4x4",
    "555": "5x5x5",
    "333oh": "3x3x3 OH",
    "pyram": "Pyraminx",
    "skewb": "Skewb",
    "minx": "Megaminx",
    "sq1": "Square-1",
    "clock": "Clock"
  };

  return nomes[codigo] || codigo;
}
