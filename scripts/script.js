function fetchAndStorePokemonData() {
  fetch("https://tyradex.vercel.app/api/v1/gen/1", {
    headers: {
      "User-Agent": "decker.thomas2911@gmail.com",
      From: "https://katynoctraining.github.io/Pokedex/",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Erreur HTTP: ${response.status}`);
        throw new Error(`Erreur HTTP, statut = ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        localStorage.setItem("originalPokemonData", JSON.stringify(data));
        localStorage.setItem("pokemonData", JSON.stringify(data));
        displayPokemonNames(data); // Affiche les Pokémon dans leur ordre original
      } else {
        throw new Error("Format de données inattendu");
      }
    })
    .catch((error) => {
      console.error(
        "Il y a eu un problème avec l'opération fetch: ",
        error.message
      );
    });
}
function displayPokemonNames(pokemonData) {
  const listContainer = document.getElementById("pokemonList");
  listContainer.innerHTML = "";

  pokemonData.forEach((pokemon) => {
    if (pokemon && pokemon.sprites && pokemon.sprites.regular) {
      const card = document.createElement("div");
      card.className = "pokemon-card";

      const spriteImage = document.createElement("img");
      spriteImage.src = pokemon.sprites.regular;
      spriteImage.alt = `Sprite de ${pokemon.name.fr}`;
      spriteImage.className = "pokemon-sprite";

      const pokemonName = document.createElement("h2");
      pokemonName.textContent = pokemon.name.fr;

      card.appendChild(spriteImage);
      card.appendChild(pokemonName);

      card.addEventListener("click", function () {
        showPokemonDetails(pokemon);
      });

      listContainer.appendChild(card);
    }
  });
}

function showPokemonDetails(pokemon) {
  const modal = document.getElementById("pokemonModal");
  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = `
    <h2>${pokemon.name.fr}</h2>
    <img src="${pokemon.sprites.regular}" alt="Sprite de ${
    pokemon.name.fr
  }" style="max-width: 100%; height: auto;">
    <div class ="card_content">
    <p class="type_txt">Type: ${pokemon.types
      .map((type) => type.name)
      .join(", ")}</p>
    <p class="stats_txt">Statistiques: HP ${pokemon.stats.hp}, Atk ${
    pokemon.stats.atk
  }, Def ${pokemon.stats.def}, Spe Atk ${pokemon.stats.spe_atk}, Spe Def ${
    pokemon.stats.spe_def
  }, Vit ${pokemon.stats.vit}</p>
    <p class ="res_txt">Résistances: ${pokemon.resistances
      .map((res) => `${res.name} ${res.multiplier}x`)
      .join(", ")}</p>
    <p class="weakness_txt">Faiblesses: ${pokemon.resistances
      .filter((res) => res.multiplier > 1)
      .map((res) => `${res.name}`)
      .join(", ")}</p>
    <p class="talents_txt">Talents: ${pokemon.talents
      .map((talent) => talent.name)
      .join(", ")}</p>
    </div>
  `;

  modal.style.display = "block";
}

document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("pokemonModal").style.display = "none";
});

window.onclick = function (event) {
  const modal = document.getElementById("pokemonModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function sortAndDisplayPokemons(statistic) {
  const pokemonData =
    JSON.parse(localStorage.getItem("originalPokemonData")) || [];
  pokemonData.sort((a, b) => b.stats[statistic] - a.stats[statistic]);

  displayPokemonNames(pokemonData);
}

function resetAndDisplayPokemons() {
  const pokemonData =
    JSON.parse(localStorage.getItem("originalPokemonData")) || [];
  displayPokemonNames(pokemonData);
}

document.addEventListener("DOMContentLoaded", (event) => {
  fetchAndStorePokemonData();
});
