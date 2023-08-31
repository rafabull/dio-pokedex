const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    const elId = "pokemon_head_" + pokemon.number;
    return {
        id: elId,
        html: `
        <li class="pokemon ${pokemon.type}" id="${elId}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
    }
}

function convertPokemonToModal(pokemon) {
    console.log(pokemon)

    // Crie um elemento div para o overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Crie um elemento div para o modal
    const modal = document.createElement('div');
    modal.classList.add('pokemon-modal');
    modal.classList.add(pokemon.types[0].type.name); 

    const modalContent = `
        <button class="close-button">&times;</button>
        <h2>${pokemon.name.toUpperCase()}</h2>
        <p class="number">#${pokemon.id}</p>
        <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}" />
        <div class="infos">
            <div>Type: <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type.type.name}">${type.type.name}</li>`).join('')}
                </ol>
            </div>
            <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p>Base Experience: ${pokemon.base_experience}</p>
            <p>Height: ${pokemon.height*10} cm</p>
            <p>Weight: ${pokemon.weight/10} Kg</p>
        <div>
    `;

    modal.innerHTML = modalContent;
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.remove();
        overlay.remove(); // Remove o overlay quando o modal é fechado
    });

    overlay.addEventListener('click', () => {
        modal.remove();
        overlay.remove(); // Remove o overlay quando o overlay é clicado
    });
}


function showPokemonDetails(event){
    let parentPokemon = event.target.closest('.pokemon');
    if (parentPokemon) {
        let id = parentPokemon.getAttribute('data-id');
        
        pokeApi.getPokemonFullDetail(id).then((detail = {}) => {
            delete detail.moves
            delete detail.game_indices
            delete detail.stats
            convertPokemonToModal(detail)
        })
    }
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.forEach((pokemon) => {
            const info = convertPokemonToLi(pokemon)
            pokemonList.innerHTML += info.html
        })

        const pokemonElements = document.querySelectorAll('.pokemon')
        pokemonElements.forEach((el) => {
            el.addEventListener('click', (event) => showPokemonDetails(event))
        })
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})