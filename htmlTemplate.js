function createBigViewPokemonHtml(
  id,
  name,
  paddedId,
  weight,
  type,
  height,
  experience,
  abilities
) {
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
