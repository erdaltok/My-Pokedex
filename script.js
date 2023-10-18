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

// holt den Hauptcontainer für alle Pokémon-Boxen
const pokeContainer = document.getElementById("poke-container");

let allPokemonBoxes = []; // hier ganz normal eckige Klammern, da ich durch ein Array durch iterieren möchte.
let currentPokemonId = 1;
let pokemonDataCache = {}; // hier geschweifte Klammern verwenden müssen, da ein String erstellt werden musste
let pokemonCache = {};

const pokeLimit = 30;


async function initPokemon() {
  for (let i = 1; i <= pokeLimit; i++) {
      await getPokemon(i);
  }
    console.log(pokemonCache);
}

async function getPokemon(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  let data = await response.json();
    console.log("Save Pokémon ID:", id, "Data:", data);

  pokemonCache[id] = data; // abgerufene Daten im Cache speichern
  createPokemonBox(data);
}

// Erstellt die Box für ein einzelnes Pokemon und fügt sie dem Hauptcontainer hinzu + generiert den HTML Code
function createPokemonBox(pokemon) {
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1); // Zieht den Namen aus der Array-API und schreibt den ersten Buchstaben groß. Mit slice wird nur der erste Buchstabe (1) groß geschrieben und der Rest wieder klein
  const id = pokemon.id.toString().padStart(3, "0"); // Erst in ein String verwandeln, damit die ID-Nummern 3-stellig werden und die nicht besetzten Stellen mit '0' ausgefüllt werden. zB. 001 statt nur 1 oder 010 statt 10.
  const weight = pokemon.weight;
  const type = pokemon.types[0].type.name;
  const color = colors[type];

  const pokemonElement = document.createElement("div");
  pokemonElement.classList.add("poke-box");
  pokemonElement.style.backgroundColor = `${color}`;

  pokemonElement.setAttribute("data-id", id); // (XXX2) Das Attribut data-id wird dem pokemonElement hinzugefügt und mit der ID des Pokémon befüllt. Mit dem kann man die ID des Pokemon erkennen, wenn auf ein Pokemon geklickt wird.

  pokemonElement.addEventListener("click", function () {
    const pokemonId = parseInt(this.getAttribute("data-id"), 10); // Wenn auf das Pokemon geklickt wird, wird die data-id extrahiert und in eine Ganzzahl umgewandelt. + Die 10, gibt an, dass die Konvertierung im Dezimalsystem (Basis 10) -- Internetrecherche -- durchgeführt werden soll.
    openBigView(pokemonId);
  });

  pokemonElement.innerHTML = createHtmlOfPokemon(id, name, weight, type);
  pokeContainer.appendChild(pokemonElement);
  allPokemonBoxes.push(pokemonElement);
}

// HTML template. (XXX1) Hier musste ich die onclick Funktion mit data-id ersetzen, da ich immer ein fehler beim Aufruf hatte und bei einigen Pokemon die falsche ID übergben worden ist. 
// in der oberen Funktion createPokemonBox(pokemon) habe ich einen EventListener einfügen müssen
function createHtmlOfPokemon(id, name, weight, type) {
  return `
<div data-id="${id}"> 
 
      <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png" alt="">
      <h4 id="poke-name" class="poke-name">${name}</h4>
      <p id="poke-id" class="poke-id">#${id}</p>
      <p class="poke-weight">${weight} kg</p>
      <p class="poke-type">Type: ${type}</p>
  </div>
  `;
}

// Search-Funktion für das Input-feld: Sucht nach Pokemon
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
// Löscht den Inhalt des Input-Feldes nach getätigter Suche
function clearInput() {
  document.getElementById("poke-input").value = "";
}

// Holt die Gesamtdaten aus dem Cache und genriert inkl. HTML Template die BigView-Ansicht + try / catch Funktion, um zu prüfen, ob ein Fehler bzw. Error kommt.
async function createBigViewPokemonBox(id) {
  try {
    let pokemon = pokemonCache[id]; // Daten aus dem Cache holen
    if (!pokemon) {
      console.error("Pokémon-Daten nicht gefunden für ID:", id);
      return "";
    }

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const paddedId = pokemon.id.toString().padStart(3, "0");
    const weight = pokemon.weight;
    const type = pokemon.types[0].type.name;
    const height = pokemon.height;
    const experience = pokemon.base_experience;
    const abilities = pokemon.abilities.map((a) => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1).toLowerCase()).join("<br><br>");

    return createBigViewPokemonHtml(id,name,paddedId,weight,type,height,experience,abilities);
  } catch (error) {
    console.error("Fehler beim Abrufen des Pokémon:", error);
    return ""; // Rückgabe eines leeren Strings im Fehlerfall
  }
}

function createBigViewPokemonHtml(id, name, paddedId, weight, type, height, experience, abilities) {
    return `
        
    <div class="center">
        <div class="poke-big-view-box">
            <div class="close-btn">
                <img src="./img/close-button.png" class="close-btn" onclick="closeBigView()"alt="">
            </div>

                <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedId}.png" alt="" onerror="console.error('Fehler beim Laden des Bildes:', this.src);">

            <nav class="nav-btns">
            <div><img src="./img/left-button.png" onclick="leftButton()" id="leftButton"></div>
            <div><img src="./img/right-button.png" onclick="rightButton()" id="rightButton"></div>
            </nav>

            <h4 class="poke-name">${name}</h4>
            <p class="poke-id">#${paddedId}</p>
            <p class="poke-type">Type: ${type}</p>

            <div class="poke-big-view-box-info" id="poke-big-view-box-info-id">
                <h2 onclick="openAbout()">About</h2>
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
                      <canvas id="myChartId" width="306" height="152" style-"display: block; box-sizing: border-box; height: 137px; width: 306px;"> </canvas>
                </div>

                <div class="box-info-ablility-details hidden" id="box-info-ablility-details-id">
                    <div class="abilities">
                        <h4>${abilities}</h4>
                </div>
            </div>
          </div>
        </div>
      </div>
  `;
 
}

// (1) Funktion nur zum Öffnen der BigView-Ansicht. Zur Übersichtlichkeit auf DREI Funktionen aufgeteilt (d.h. inkl. den beiden folgenden Funktionen "displayBigView(id)" und "setupPokemonStatsChart(id)")
async function openBigView(id) {
     console.log("Opening Big View for Pokémon ID:", id);

   if (!pokemonCache[id]) {
     await getPokemon(id);
   }

   // Zeigt die detaillierte Ansicht
   const bigViewContainer = document.getElementById("big-view-poke-container");
   bigViewContainer.innerHTML = await createBigViewPokemonBox(id); // Hier wird der HTML-Code eingefügt.

   displayBigView(id); // Ruft die displayBigView NACH dem einfügen des HTML auf. Reihenfolge war wichtig, weil erst der HTML-Code erst vollständig generiert werden musste, damit BigView auch angezeigt wird. + Zugriff auf big-view-poke-container in der nächsten Funktion, war erst möglch, nachdem die HTML bereits vollständig geladen worden ist.
   pokemonStatsChart(id);
   updateNavigationButtons();
   openAbout();
 }
// (2) Reihenfolge war wichtig, weil erst der HTML-Code erst vollständig generiert werden musste. Zugriff auf big-view-poke-container in der nächsten Funktion, war erst möglch, nachdem die HTML bereits vollständig geladen worden ist.
 function displayBigView(id) {
   const bigViewContainer = document.getElementById("big-view-poke-container");

   const type = pokemonCache[id].types[0].type.name;
   const color = colors[type];
   const bigViewBox = bigViewContainer.querySelector(".poke-big-view-box");

   if (bigViewBox) {
     bigViewBox.style.backgroundColor = color;
   } else {
     console.error("Element .poke-big-view-box nicht gefunden");
   }

   bigViewContainer.style.display = "block";
   currentPokemonId = id;

   CloseOnOutsideClick(); // Funktionsaufruf, um die Close-Funktion außerhalb von der Pokemon-Box in der BigView einzufügen
 }

// (3) Funktion für die Stats in Chart.js. Hierzu separate Datei erstellt "pokemonChart.js" und diesen im HTML "<script src="pokemonChart.js"></script>" eingefügt.
 function pokemonStatsChart(id) {
   const ctx = document.getElementById("myChartId").getContext("2d");
   const labels = [
     "hp",
     "attack",
     "defense",
     "special-attack",
     "special-defense",
     "speed",
   ];
   const pokemonStats = getPokemonStats(pokemonCache[id]);
   const data = labels.map((label) => pokemonStats[label]);
   const type = pokemonCache[id].types[0].type.name;

   createPokemonChart(ctx, labels, data, colors[type]);
 }

// Zieht die Stats aus dem Parameter: Pokémon
 function getPokemonStats(pokemon) {
   let stats = {}; // hier geschweifte Klammern verwenden müssen, da ein String erstellt werden musste
   pokemon.stats.forEach((stat) => {
     stats[stat.stat.name] = stat.base_stat;
   });
   return stats;
 }

// schließt die BigView-Ansicht
function closeBigView() {
  const bigViewContainer = document.getElementById("big-view-poke-container");
  bigViewContainer.style.display = "none";
}

// Event-Listener hinzu, um die BigView-Ansicht zu schließen, wenn außerhalb der Box geklickt wird
function CloseOnOutsideClick() {
  const bigViewContainer = document.getElementById("big-view-poke-container");

  bigViewContainer.addEventListener("click", function (event) {   
    if (event.target === bigViewContainer) { // schließt BigView-Ansicht , wenn auf innerhaln der DIV "big-view-poke-container" geklickt wird 
      closeBigView();
    }
  });
}

// nach links navigieren
function leftButton() {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    openBigView(currentPokemonId);
  }
  updateNavigationButtons();
}

// nach rechts navigieren
function rightButton() {
  if (currentPokemonId < pokeLimit) {
    // pokeLimit ist die maximale Anzahl von Pokémon, die Sie anzeigen möchten
    currentPokemonId++;
    openBigView(currentPokemonId);
  }
  updateNavigationButtons();
}

// beim ersten Pokemon wird der "rightButton" ausgeblendet und beim letzen Pokemon "leftButton" ausgeblendet
function updateNavigationButtons() {
  const leftNavButton = document.getElementById("leftButton");
  const rightNavButton = document.getElementById("rightButton");

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

// Zeigt den Bereich "About" an und blendet stats und ablilities aus
function openAbout() {
  const aboutDetails = document.querySelector(".box-info-about");
  const statsDetails = document.querySelector(".box-info-stats-details");
  const abilityDetails = document.querySelector(".box-info-ablility-details");

  aboutDetails.classList.remove("hidden");
  statsDetails.classList.add("hidden");
  abilityDetails.classList.add("hidden");
}

// Zeigt den Bereich "stats" an und blendet about und ablilities aus
function openChart() {
  const aboutDetails = document.querySelector(".box-info-about");
  const statsDetails = document.querySelector(".box-info-stats-details");
  const abilityDetails = document.querySelector(".box-info-ablility-details");

  aboutDetails.classList.add("hidden");
  statsDetails.classList.remove("hidden");
  abilityDetails.classList.add("hidden");
}

// Zeigt den Bereich "ablilities" an und blendet about und stats aus
function openAbilities() {
  const aboutDetails = document.querySelector(".box-info-about");
  const statsDetails = document.querySelector(".box-info-stats-details");
  const abilityDetails = document.querySelector(".box-info-ablility-details");

  aboutDetails.classList.add("hidden");
  statsDetails.classList.add("hidden");
  abilityDetails.classList.remove("hidden");
}

initPokemon();
