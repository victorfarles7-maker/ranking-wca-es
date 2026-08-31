let dados = {};
let rankingAtual = [];
let tipoAtual = "capixabas";


fetch("dados.json")
  .then(res => res.json())
  .then(data => {
    dados = data;
    mostrarRanking("capixabas");
  });


function mostrarRanking(tipo) {
  console.log("TIPO:", tipo);
  console.log("DADOS:", dados);
  console.log("COMPETIÇÕES:", dados.competicoesES);

  tipoAtual = tipo;
  rankingAtual = dados[tipo];

  // Rankings de medalhas
  if (tipo !== "recordes" && tipo !== "competicoesES") {
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


  // =========================
  // RECORDES
  // =========================

  if (tipo === "recordes") {
    Object.keys(listaDados).forEach(evento => {
      const bloco = document.createElement("div");

      bloco.innerHTML = `
        <h2 class="evento-titulo">
          <img src="icons/${evento}.svg" class="icone-evento">
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


  // =========================
  // CAMPEONATOS NO ES
  // =========================

  if (tipo === "competicoesES") {
    const lista = document.createElement("div");
    lista.className = "lista-competicoes";

    listaDados.forEach(c => {
      const item = document.createElement("div");
      item.className = "competicao";

      item.innerHTML = `
        <div>
          <h2>${c.nome}</h2>
          <p>${c.data} • ${c.cidade}</p>
        </div>

        <a href="${c.link}" target="_blank" rel="noopener noreferrer">
          Ver na WCA
        </a>
      `;

      lista.appendChild(item);
    });

    container.appendChild(lista);

    return;
  }


  // =========================
  // RANKING DE MEDALHAS
  // =========================

  container.innerHTML = "<ul></ul>";

  const lista = container.querySelector("ul");

 let posicao = 1;

listaDados.forEach((p, i) => {

  // Se as medalhas forem diferentes das da pessoa anterior,
  // a posição passa a ser a posição real na lista
  if (
    i > 0 &&
    (
      p.ouro !== listaDados[i - 1].ouro ||
      p.prata !== listaDados[i - 1].prata ||
      p.bronze !== listaDados[i - 1].bronze
    )
  ) {
    posicao = i + 1;
  }

  const item = document.createElement("li");

  item.textContent =
    `${posicao}. ${p.nome} 🥇${p.ouro} 🥈${p.prata} 🥉${p.bronze}`;

  lista.appendChild(item);
});
}


function filtrar() {
  const termo = document.getElementById("busca").value.toLowerCase();

  // Busca por nome do campeonato
  if (tipoAtual === "competicoesES") {
    const filtrados = rankingAtual.filter(c =>
      c.nome.toLowerCase().includes(termo)
    );

    renderizar(filtrados, tipoAtual);
    return;
  }

  // Não faz busca nos recordes
  if (tipoAtual === "recordes") {
    return;
  }

  // Busca por nome da pessoa
  const filtrados = rankingAtual.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );

  renderizar(filtrados, tipoAtual);
}


function traduzirEvento(codigo) {
  const nomes = {
    "333": "3x3x3",
    "222": "2x2x2",
    "444": "4x4x4",
    "555": "5x5x5",
    "666": "6x6x6",
    "777": "7x7x7",
    "333bf": "3x3x3 Vendado",
    "333fm": "3x3x3 em Menos Movimentos",
    "333oh": "3x3x3 OH",
    "pyram": "Pyraminx",
    "skewb": "Skewb",
    "minx": "Megaminx",
    "sq1": "Square-1",
    "clock": "Clock",
    "4bld": "4x4x4 Vendado",
    "5bld": "5x5x5 Vendado",
    "mbld": "3x3x3 Múltiplos Cubos Vendado"
  };

  return nomes[codigo] || codigo;
}
