function fetchAndStorePokemonData() {
  fetch("https://tyradex.vercel.app/api/v1/gen/1")
    .then((response) => {
      if (!response.ok) {
        console.error(`Erreur HTTP: ${response.status}`);
        throw new Error(`Erreur HTTP, statut = ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Assurez-vous que 'data' est un tableau
      if (Array.isArray(data)) {
        localStorage.setItem("pokemonData", JSON.stringify(data));
        displayPokemonNames();
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

function displayPokemonNames() {
  const pokemonData = JSON.parse(localStorage.getItem("pokemonData")) || [];
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

      const pokemonName = document.createElement("p");
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

// Appeler la fonction pour récupérer et afficher les données
fetchAndStorePokemonData();

function showPokemonDetails(pokemon) {
  const modal = document.getElementById("pokemonModal");
  const modalBody = document.getElementById("modalBody");

  // Construction du contenu de la modale
  modalBody.innerHTML = `
    <h2>${pokemon.name.fr}</h2>
    <img src="${pokemon.sprites.regular}" alt="Sprite de ${
    pokemon.name.fr
  }" style="max-width: 100%; height: auto;">
    <p>Type: ${pokemon.types.map((type) => type.name).join(", ")}</p>
    <p>Statistiques: HP ${pokemon.stats.hp}, Atk ${pokemon.stats.atk}, Def ${
    pokemon.stats.def
  }, Spe Atk ${pokemon.stats.spe_atk}, Spe Def ${pokemon.stats.spe_def}, Vit ${
    pokemon.stats.vit
  }</p>
    <p>Résistances: ${pokemon.resistances
      .map((res) => `${res.name} ${res.multiplier}x`)
      .join(", ")}</p>
    <p>Faiblesses: ${pokemon.resistances
      .filter((res) => res.multiplier > 1)
      .map((res) => `${res.name}`)
      .join(", ")}</p>
    <p>Talents: ${pokemon.talents.map((talent) => talent.name).join(", ")}</p>
  `;

  modal.style.display = "block";
}

// Lorsque l'utilisateur clique sur <span> (x), ferme la modale
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("pokemonModal").style.display = "none";
});

// Lorsque l'utilisateur clique en dehors de la modale, elle se ferme aussi
window.onclick = function (event) {
  const modal = document.getElementById("pokemonModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
