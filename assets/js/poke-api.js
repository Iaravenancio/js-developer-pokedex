const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    pokemon.types = types
    pokemon.type = types[0]

    pokemon.photo =
        pokeDetail.sprites.other.dream_world.front_default ||
        pokeDetail.sprites.other['official-artwork'].front_default ||
        pokeDetail.sprites.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => {
            if (!response.ok) throw new Error("Erro ao buscar detalhes");
            return response.json();
        })
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error("Erro ao buscar lista");
            return response.json();
        })
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
}

pokeApi.getPokemonDetailById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error("Pokémon não encontrado");
            return response.json();
        });
};
