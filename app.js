let dados = {};
let rankingAtual = [];

fetch("dados.json")
  .then(res => res.json())
  .then(data => {
    dados = data;
    mostrarRanking("capixabas");
  });

function mostrarRanking(tipo) {
  rankingAtual = [...dados[tipo]];

  // Ordenação completa
  rankingAtual.sort((a, b) => {
    if (b.ouro !== a.ouro) return b.ouro - a.ouro;
    if (b.prata !== a.prata) return b.prata - a.prata;
    if (b.bronze !== a.bronze) return b.bronze - a.bronze;

    // empate total → ordem alfabética
    return a.nome.localeCompare(b.nome);
  });

  renderizar(rankingAtual);
}

function renderizar(listaDados) {
  const lista = document.getElementById("ranking");
  lista.innerHTML = "";

  listaDados.forEach((p, i) => {
    const item = document.createElement("li");

    // Se for recorde
    if (p.evento) {
      item.innerHTML = `
        <strong>${p.evento} (${p.tipo})</strong><br>
        🥇 ${p.resultado} — ${p.nome}
      `;
    } else {
      // ranking normal
      item.textContent = `${i + 1}. ${p.nome} 🥇${p.ouro} 🥈${p.prata} 🥉${p.bronze}`;
    }

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
