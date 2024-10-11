const pesquisaInput = document.querySelector("#pesquisa");
const gamesContainer = document.querySelector(".section-games-01");
const menuHamburguer = document.querySelector(".hamburger");
const carrosel = document.querySelector(".carousel");
const corpo = document.querySelector("#main");

async function carregaJogos() {
  try {
    const requisição = await fetch("./assets/json/db.json");

    if (!requisição.ok) {
      throw new Error("Erro na requisição, não foi possível se conectar!");
    }
    const dados = await requisição.json();
    const bancoDeDados = dados;
    const carregamentoDeImagem = bancoDeDados.map((item) =>
      carregaImagem(item.img)
    );
    await Promise.all(carregamentoDeImagem); // Espera todas as promessas serem resolvidas
    mostraJogos(bancoDeDados);
  } catch (error) {
    console.error("Houve um problema com a operação fetch:", error);
  }
}

function carregaImagem(src) {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.onload = () => {
      resolve();
    };
    imagem.onerror = () => {
      reject(new Error(`Erro ao carregar imagem: ${src}`));
    };
    imagem.src = src;
  });
}

function mostraJogos(data) {
  gamesContainer.innerHTML = "";
  data.forEach((item) => {
    criaCards(
      item.nome,
      item.img,
      item.descricao,
      item.download,
      item.requisitos,
      item.categoria
    );
  });
}

function criaCards(nome, img, descricao, download, requisitos, categoria) {
  const propriedades = [nome, img, descricao, download, requisitos, categoria];
  const criaDiv = document.createElement("div");
  criaDiv.classList.add("cards-section-games-01");
  criaDiv.setAttribute("data-aos", "flip-left");
  criaDiv.setAttribute("data-aos-easing", "ease-out-cubic");
  criaDiv.setAttribute("data-aos-duration", "2000");
  gamesContainer.classList.remove("section-games-02");
  gamesContainer.classList.add("section-games-01");
  corpo.removeAttribute("id", "main2");
  corpo.setAttribute("id", "main");

  criaDiv.innerHTML = `
    <img src="${img}" alt="${nome}">
    <h2 class="titulo-game">${nome}</h2>
  `;
  gamesContainer.appendChild(criaDiv);
  click(...propriedades);
}

function click(nome, img, descricao, download, requisitos, categoria) {
  const criaDiv = document.querySelectorAll(".cards-section-games-01");
  criaDiv.forEach((card) => {
    card.addEventListener("click", () => {
      gamesContainer.innerHTML = "";
      criaDetalhes(nome, img, descricao, download, requisitos, categoria);
    });
  });
}

function criaDetalhes(nome, img, descricao, download, requisitos, categoria) {
  carrosel.style.display = "none";
  gamesContainer.innerHTML = "";

  const criaDiv = document.createElement("div");
  criaDiv.classList.add("detalhes-jogo");
  criaDiv.innerHTML = `
    <div class="detalhes-jogo-corpo">
      <img class="cards-section-games-01" src="${img}" alt="${nome}">
      <h2 class="titulo-jogo">${nome}</h2>
      <p class="requisitos">${requisitos}</p>
      <p class="descrição">${descricao}</p>
      <a href="${download}" class="btn-download">Download</a>
      <button class="btn-voltar">Voltar para o início</button>
      <br>
      <div id="disqus_thread"></div>
    </div>
  `;

  gamesContainer.appendChild(criaDiv);

  const btnVoltar = criaDiv.querySelector(".btn-voltar");
  btnVoltar.addEventListener("click", () => {
    gamesContainer.innerHTML = "";
    carrosel.style.display = "block";
    carregaJogos();
  });

  // Inicializar o Disqus thread para esta página
  var disqus_config = function () {
    this.page.url = window.location.href;
    console.log(nome);
    this.page.identifier = nome; // Use um identificador único para cada jogo
  };

  disqus_config();

  // Recarregar o script do Disqus para que ele saiba sobre a nova discussão
  var disqusScript = document.createElement("script");
  disqusScript.src = "https://games-torrent-1.disqus.com/embed.js";
  disqusScript.setAttribute("data-timestamp", +new Date());
  (document.head || document.body).appendChild(disqusScript);
}

function hamburguer() {
  const spans = document.querySelectorAll(".hamburger span");
  menuHamburguer.classList.toggle("hamburger-baixo");
  spans[0].classList.toggle("hamburgerPiece1");
  spans[1].classList.toggle("hamburgerPiece2");
  spans[2].classList.toggle("hamburgerPiece2");

  if (menuHamburguer.classList.contains("hamburger-baixo")) {
    const criaDiv = document.createElement("div");
    criaDiv.classList.add("barra-lateral");
    criaDiv.innerHTML = `
      <h2 class="listadoMenu">Menu</h2>
      <button class="botaoMenu">Início</button>
      <button class="botaoMenu" id="categoria">Categorias</button>
    `;
    corpo.appendChild(criaDiv);

    const botaoInicio = criaDiv.querySelector(".botaoMenu");
    botaoInicio.addEventListener("click", () => {
      gamesContainer.innerHTML = "";
      carrosel.style.display = "block";
      carregaJogos();
      fechaBarraLateral();
    });

    const categoria = criaDiv.querySelector("#categoria");
    categoria.addEventListener("click", () => {
      carrosel.style.display = "none";
      criaOpcao();
      fechaBarraLateral();
    });
  } else if (!menuHamburguer.classList.contains("hamburger-baixo")) {
    spans[0].classList.toggle("hamburgerPiece1");
    spans[1].classList.toggle("hamburgerPiece2");
    spans[2].classList.toggle("hamburgerPiece2");
    menuHamburguer.classList.toggle("hamburger-baixo");
    fechaBarraLateral();
  }

  function fechaBarraLateral() {
    spans[0].classList.toggle("hamburgerPiece1");
    spans[1].classList.toggle("hamburgerPiece2");
    spans[2].classList.toggle("hamburgerPiece2");
    menuHamburguer.classList.toggle("hamburger-baixo");
    const barraLateral = document.querySelector(".barra-lateral");
    corpo.removeChild(barraLateral);
  }
}

pesquisaInput.addEventListener("input", (e) => {
  const letras = e.target.value.toLowerCase();
  carrosel.style.display = "none";
  pesquisaEfiltra(letras);
  if (e.target.value === "") {
    carrosel.style.display = "block";
    carregaJogos();
  }
});

menuHamburguer.addEventListener("click", hamburguer);

function pesquisaEfiltra(letras) {
  if (bancoDeDados) {
    const filtrados = bancoDeDados.filter((item) =>
      item.nome.toLowerCase().includes(letras)
    );
    gamesContainer.innerHTML = "";
    filtrados.forEach((item) =>
      criaCards(
        item.nome,
        item.img,
        item.descricao,
        item.download,
        item.requisitos,
        item.categoria
      )
    );
  }
}

function criaOpcao() {
  gamesContainer.classList.remove("section-games-02");
  gamesContainer.classList.add("section-games-01");
  corpo.removeAttribute("id", "main2");
  corpo.setAttribute("id", "main");
  gamesContainer.innerHTML = "";
  const listaOpcao = ["Selecione", "Alfabeto", "Gênero"];
  const criaSelect = document.createElement("select");
  criaSelect.classList.add("selecione");
  for (let opcao of listaOpcao) {
    const option = document.createElement("option");
    option.setAttribute("class", "opcao");
    option.setAttribute("value", `${opcao}`);
    option.innerText = `${opcao}`;
    criaSelect.appendChild(option);
  }
  gamesContainer.appendChild(criaSelect);

  criaSelect.addEventListener("change", function () {
    const valorSelecionado = this.value;

    if (valorSelecionado === "Alfabeto") {
      criaCategoriasAlfabeto();
    } else if (valorSelecionado === "Gênero") {
      criaCategoriasGenero();
    } else {
      console.log("Opção desconhecida selecionada.");
    }
  });
}

function criaCategoriasAlfabeto() {
  gamesContainer.classList.remove("section-games-01");
  gamesContainer.classList.add("section-games-02");
  corpo.removeAttribute("id", "main");
  corpo.setAttribute("id", "main2");

  gamesContainer.innerHTML = "";

  const alfabeto = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "Y",
    "Z",
  ];
  for (let i = 0; i < alfabeto.length; i++) {
    const criaDiv = document.createElement("div");
    criaDiv.classList.add("bloco");
    criaDiv.innerText = `${alfabeto[i]}`;
    gamesContainer.appendChild(criaDiv);
  }

  document.addEventListener("click", (e) => {
    const evento = e.target;
    if (evento.classList.contains("bloco")) {
      const letraClicada = evento.innerText;
      const filtrados = bancoDeDados.filter(
        (item) => item.nome.charAt(0).toUpperCase() === letraClicada
      );
      gamesContainer.innerHTML = "";
      filtrados.forEach((item) =>
        criaCards(
          item.nome,
          item.img,
          item.descricao,
          item.download,
          item.requisitos,
          item.categoria
        )
      );
    }
  });
}

function criaCategoriasGenero() {
  gamesContainer.classList.remove("section-games-01");
  gamesContainer.classList.add("section-games-02");
  corpo.removeAttribute("id", "main");
  corpo.setAttribute("id", "main2");
  gamesContainer.innerHTML = "";

  const generos = [
    "Ação",
    "Terror",
    "Fantasia",
    "Corrida",
    "FPS",
    "Mobile",
    "RPG",
    "Luta",
    "Super-herói",
    "Esporte",
    "Aventura",
    "Anime",
    "Simulador",
  ];

  for (let i = 0; i < generos.length; i++) {
    const criaDiv = document.createElement("div");
    criaDiv.classList.add("bloco");
    criaDiv.innerText = `${generos[i]}`;
    gamesContainer.appendChild(criaDiv);
  }

  document.addEventListener("click", (e) => {
    const evento = e.target;
    if (evento.classList.contains("bloco")) {
      const generoClicado = evento.innerText.toLowerCase();
      const filtrados = bancoDeDados.filter(
        (item) =>
          item.categoria && item.categoria.toLowerCase() === generoClicado
      );
      gamesContainer.innerHTML = "";
      filtrados.forEach((item) =>
        criaCards(
          item.nome,
          item.img,
          item.descricao,
          item.download,
          item.requisitos,
          item.categoria
        )
      );
    }
  });
}

AOS.init();
carregaJogos();
