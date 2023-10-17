const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#d6b3ff",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  ice: "#e0f5ff ",
};

const searchInput = document.getElementById("poke-input");
const searchBtn = document.getElementById("btn-search");
const pokeContainer = document.getElementById("poke-container");

let allPokemonBoxes = [];
let currentPokemonId = 1;
const pokeLimit = 20;

async function initPokemon() {
  for (let i = 1; i <= pokeLimit; i++) {
      await getPokemon(i);
  }
}

async function getPokemon(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let data = await response.json();
  createPokemonBox(data);
}

function createPokemonBox(pokemon) {
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1); // Zieht den Namen aus dem ArrayApi und schreibt den ersten Buchstaben groß. Mit slice wird nur der erste Buchstabe (1) groß geschrieben und der Rest wieder klein
  const id = pokemon.id.toString().padStart(3, "0"); // Erst in ein String verwandeln, dann die ID-Nummern 3-Stellig werden und die nicht besetzten Stellen mit '0' ausgefüllt werden. zB. 001 statt nur 1 oder 010 statt 10.
  const weight = pokemon.weight;
  const type = pokemon.types[0].type.name;
  const color = colors[type];

  const pokemonElement = document.createElement("div");
  pokemonElement.classList.add("poke-box");
  pokemonElement.style.backgroundColor = `${color}`;

  pokemonElement.innerHTML = createHtmlOfPokemon(id, name, weight, type);
  pokeContainer.appendChild(pokemonElement);
  allPokemonBoxes.push(pokemonElement);
}

function createHtmlOfPokemon(id, name, weight, type) {
  return `
  <div onclick="openBigView(${id})">
      <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png" alt="">
      <h4 id="poke-name" class="poke-name">${name}</h4>
      <p id="poke-id" class="poke-id">#${id}</p>
      <p class="poke-weight">${weight} kg</p>
      <p class="poke-type">Type: ${type}</p>
  </div>
  `;
}

function filterNames() {
  let pokeSearch = document.getElementById("poke-input").value.toLowerCase();
  pokeContainer.innerHTML = "";
  // Erster Versuch mit Arrow Function und querySelector
  allPokemonBoxes.forEach((box) => {
    const boxName = box.querySelector(".poke-name").textContent.toLowerCase();
    const boxID = box.querySelector(".poke-id").textContent.replace("#", ""); // '#' entfernen, um nur die ID zu erhalten

    if (boxName.includes(pokeSearch) || boxID.includes(pokeSearch)) {
      pokeContainer.appendChild(box);
    }
  });
}

function clearInput() {
  document.getElementById("poke-input").value = "";
}

function createBigViewPokemonBox(pokemon) {
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, "0");
    const weight = pokemon.weight;
    const type = pokemon.types[0].type.name;
    const height = pokemon.height;
    const experience = pokemon.base_experience;
    const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");

    

    return `
        
        <div class="poke-big-view-box">
            <div class="close-btn">
                <img src="./img/close-btn.png" class="close-btn" onclick="closeBigView()"alt="">
            </div>
            <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png" alt="">
            <nav class="nav-btns">
            <div><img src="./img/left-btn.png" onclick="leftButton()" id="leftButton"></div>
            <div><img src="./img/right-btn.png" onclick="rightButton()" id="rightButton"></div>
            </nav>
            <h4 class="poke-name">${name}</h4>
            <p class="poke-id">#${id}</p>
            <p class="poke-type">Type: ${type}</p>
            <div class="poke-big-view-box-info" id="poke-big-view-box-info-id">
                <h2 onclick="openAbout()" class="underlined">About</h2>
                <h2 onclick="openChart()">Stats</h2>
                <h2 onclick="openAbilities()">Abilities</h2>
            </div>
            <div class="poke-big-view-box-info-content">

                <div class="box-info-about hidden" id="box-info-about-id">

                    <div class="box-info-about-details">
                        <h4><b>Weight:</b></h4>
                        <h4 class="poke-weight">${weight} kg</h4>
                    </div>
                    <div class="box-info-about-details">
                        <h4><b>Height:</b></h4>
                        <h4>${height} m</h4>
                    </div>
                    <div class="box-info-about-details">
                        <h4><b>Experience:</b></h4>
                        <h4>${experience}</h4>
                    </div>
            </div>

                <div class="box-info-stats-details hidden" id="box-info-stats-details-id">
                        <canvas id="myChartId" width="306" height="152" style-"display: block; box-sizing: border-box; height: 152px; width: 306px;"> </canvas>
                </div>

                <div class="box-info-ablility-details hidden" id="box-info-ablility-details-id">
                    <div class="abilities">
                        <h4>${abilities}</h4>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function openBigView(id) {
  const bigViewContainer = document.getElementById("big-view-poke-container");
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let pokemon = await response.json();
    const type = pokemon.types[0].type.name;
    const color = colors[type];

    bigViewContainer.innerHTML = createBigViewPokemonBox(pokemon);
    const bigViewBox = bigViewContainer.querySelector(".poke-big-view-box");
    bigViewBox.style.backgroundColor = color;
    bigViewContainer.style.display = "block";

    let pokemonStats = {};
    pokemon.stats.forEach((stat) => {
      pokemonStats[stat.stat.name] = stat.base_stat;
    });

    const ctx = document.getElementById("myChartId");
    const labels = [
      "hp",
      "attack",
      "defense",
      "special-attack",
      "special-defense",
      "speed",
    ];
    const data = labels.map((label) => pokemonStats[label]);

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Base Stats",
            data: data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: colors[type],
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: {
            display: false,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    currentPokemonId = id;
    updateNavigationButtons();
  } catch (error) {
    console.error("Fehler beim Abrufen des Pokémon:", error);
  }

  openAbout();
}



function closeBigView() {
  const bigViewContainer = document.getElementById("big-view-poke-container");

  bigViewContainer.style.display = "none";
}

function leftButton() {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    openBigView(currentPokemonId);
  }
  updateNavigationButtons();
}

function rightButton() {
  if (currentPokemonId < pokeLimit) {
    // pokeLimit ist die maximale Anzahl von Pokémon, die Sie anzeigen möchten
    currentPokemonId++;
    openBigView(currentPokemonId);
  }
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const leftNavButton = document.getElementById("leftButton");
  const rightNavButton = document.getElementById("rightButton");

  if (!leftNavButton || !rightNavButton) {
    console.error("Navigationsbuttons nicht gefunden!");
    return;
  }

  if (currentPokemonId <= 1) {
    leftNavButton.style.display = "none";
  } else {
    leftNavButton.style.display = "block";
  }

  if (currentPokemonId >= pokeLimit) {
    rightNavButton.style.display = "none";
  } else {
    rightNavButton.style.display = "block";
  }
}

function openAbout() {
  const aboutDetails = document.querySelector(".box-info-about");
  const statsDetails = document.querySelector(".box-info-stats-details");
  const abilityDetails = document.querySelector(".box-info-ablility-details");

  aboutDetails.classList.remove("hidden");
  statsDetails.classList.add("hidden");
  abilityDetails.classList.add("hidden");
}

function openChart() {
  const aboutDetails = document.querySelector(".box-info-about");
  const statsDetails = document.querySelector(".box-info-stats-details");
  const abilityDetails = document.querySelector(".box-info-ablility-details");

  aboutDetails.classList.add("hidden");
  statsDetails.classList.remove("hidden");
  abilityDetails.classList.add("hidden");
}

function openAbilities() {
  const aboutDetails = document.querySelector(".box-info-about");
  const statsDetails = document.querySelector(".box-info-stats-details");
  const abilityDetails = document.querySelector(".box-info-ablility-details");

  aboutDetails.classList.add("hidden");
  statsDetails.classList.add("hidden");
  abilityDetails.classList.remove("hidden");
}





initPokemon();
