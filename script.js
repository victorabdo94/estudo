let cardContainer = document.querySelector("main");
let campoBusca = document.querySelector("div input");
let botaoBusca = document.querySelector("#botao-busca");
let paginacaoContainer = document.querySelector(".paginacao-container");

let dados = [];
let dadosFiltrados = [];
let paginaAtual = 1;
const itensPorPagina = 5;

document.addEventListener("DOMContentLoaded", carregarDados);

async function carregarDados() {
   let resposta = await fetch ("data.json");
   dados = await resposta.json();
   renderizarCards(dados);
   dadosFiltrados = dados;
 
    botaoBusca.addEventListener("click", realizarBusca);
    campoBusca.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            realizarBusca();
        }
    });
}

function realizarBusca() {
    paginaAtual = 1; // Reseta para a primeira página a cada nova busca
    const termoBusca = campoBusca.value.toLowerCase();
    dadosFiltrados = dados.filter(item => 
        item.nome.toLowerCase().includes(termoBusca) ||
        item.descricao.toLowerCase().includes(termoBusca) ||
        item.tags.some(tag => tag.toLowerCase().includes(termoBusca))
    );
    renderizarCards(dadosFiltrados);
}

function renderizarCards(items) {
   cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar os novos

   const startIndex = (paginaAtual - 1) * itensPorPagina;
   const endIndex = startIndex + itensPorPagina;
   const itensNaPagina = items.slice(startIndex, endIndex);

   if (itensNaPagina.length === 0 && paginaAtual > 1) { // Caso a página atual fique vazia após uma busca
        paginaAtual--;
        renderizarCards(items);
        return;
   }

   for (let dado of itensNaPagina) {
      let article = document.createElement("article");
      // Adicionado um bloco para a imagem e outro para o conteúdo de texto
      article.innerHTML = `
         <div class="card-imagem">
            <img src="${dado.imagem}" alt="Imagem da capa do jogo ${dado.nome}">
         </div>
         <div class="card-conteudo">
            <h2>${dado.nome}</h2>
            <p><strong>Ano de lançamento:</strong> ${dado.data_criacao}</p>
            <p>${dado.descricao}</p>                
            <a href="${dado.link}" target="_blank">Saiba Mais</a>
         </div>
      `
      cardContainer.appendChild(article);
   }
   renderizarPaginacao(items.length);
}

function renderizarPaginacao(totalItems) {
    paginacaoContainer.innerHTML = "";
    const totalPaginas = Math.ceil(totalItems / itensPorPagina);

    if (totalPaginas <= 1) return; // Não mostra paginação se houver apenas uma página

    // Botão Anterior
    if (paginaAtual > 1) {
        const botaoAnterior = document.createElement("button");
        botaoAnterior.innerText = "Anterior";
        botaoAnterior.addEventListener("click", () => {
            paginaAtual--;
            renderizarCards(dadosFiltrados);
        });
        paginacaoContainer.appendChild(botaoAnterior);
    }

    // Botões de Página
    for (let i = 1; i <= totalPaginas; i++) {
        const botaoPagina = document.createElement("button");
        botaoPagina.innerText = i;
        if (i === paginaAtual) {
            botaoPagina.classList.add("active");
        }
        botaoPagina.addEventListener("click", () => {
            paginaAtual = i;
            renderizarCards(dadosFiltrados);
        });
        paginacaoContainer.appendChild(botaoPagina);
    }

    // Botão Próximo
    if (paginaAtual < totalPaginas) {
        const botaoProximo = document.createElement("button");
        botaoProximo.innerText = "Próximo";
        botaoProximo.addEventListener("click", () => {
            paginaAtual++;
            renderizarCards(dadosFiltrados);
        });
        paginacaoContainer.appendChild(botaoProximo);
    }
}