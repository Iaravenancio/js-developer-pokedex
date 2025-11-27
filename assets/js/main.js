const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const nextPageCount = offset + limit;

    if (nextPageCount >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.remove();
    } else {
        loadPokemonItens(offset, limit);
    }
});


pokemonList.addEventListener("click", async (event) => {
    const item = event.target.closest(".pokemon");
    if (!item) return;

    const id = item.getAttribute("data-id");
    const data = await pokeApi.getPokemonDetailById(id);
    openModal(data);
});

function openModal(pokemon) {
    const modal = document.getElementById("pokemonModal");
    const body = document.getElementById("modalBody");

    const image = 
        pokemon.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon.sprites?.front_default;

    body.innerHTML = `
        <h2 style="text-transform: capitalize;">${pokemon.name} (#${pokemon.id})</h2>
        
        <img src="${image}" width="150">

        <h3>Tipos:</h3>
        <p>${pokemon.types.map(t => t.type.name).join(', ')}</p>

        <h3>Altura:</h3>
        <p>${pokemon.height / 10} m</p>

        <h3>Peso:</h3>
        <p>${pokemon.weight / 10} kg</p>

        <h3>Habilidades:</h3>
        <p>${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
    `;

    modal.classList.remove("hidden");
}

document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("pokemonModal").classList.add("hidden");
});

document.getElementById("pokemonModal").addEventListener("click", (e) => {
    if (e.target.id === "pokemonModal") {
        document.getElementById("pokemonModal").classList.add("hidden");
    }
});
