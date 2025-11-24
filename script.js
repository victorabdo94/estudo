let cardContainer = document.querySelector("main");
let campoBusca = document.querySelector("div input");
let botaoBusca = document.querySelector("#botao-busca");
let dados = [];

document.addEventListener("DOMContentLoaded", carregarDados);

async function carregarDados() {
   let resposta = await fetch ("data.json");
   dados = await resposta.json();
   renderizarCards(dados);

    botaoBusca.addEventListener("click", realizarBusca);
    campoBusca.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            realizarBusca();
        }
    });
}

function realizarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();
    const resultados = dados.filter(item => 
        item.nome.toLowerCase().includes(termoBusca) ||
        item.descricao.toLowerCase().includes(termoBusca)
    );
    renderizarCards(resultados);
}

function renderizarCards(dados) {
   cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar os novos
   for (let dado of dados) {
      let article = document.createElement("article");
      article.innerHTML = `
                <h2>${dado.nome}</h2>
                <p><strong>Ano de lançamento:</strong> ${dado.ano}</p>
                <p>${dado.descricao}</p>                
                <a href="${dado.link}" target="_blank">Documentação Oficial</a>
      `
      cardContainer.appendChild(article);
   }
}