const fs = require('fs');

const favorites = {};
const team = {};

// load in pokemon json file to use
const pokedex = JSON.parse(fs.readFileSync(`${__dirname}/../pokedex.json`, 'utf8'));

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }
  response.end();
};

const getPokemon = (request, response) => {
  const stringPokemon = JSON.stringify(pokedex);
  const responseJSON = {
    message: stringPokemon,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getFavorites = (request, response) => {
  const stringFavorites = JSON.stringify(favorites);
  const responseJSON = {
    message: stringFavorites,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getTeam = (request, response) => {
  const stringTeam = JSON.stringify(team);
  const responseJSON = {
    message: stringTeam,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getPokeID = (request, response, pokeID) => {

  const pokemon = pokedex.find((p) => p.id === parseInt(pokeID));

  if (!pokemon) {
    return respondJSON(request, response, 404, { message: 'Pokémon not found' });
  }
  const stringPokemon = JSON.stringify(pokemon);
  return respondJSON(request, response, 200, stringPokemon);
};

const getPokeName = (request, response, pokeName) => {
  const pokemon = pokedex.find((p) => p.name === pokeName);

  if (!pokemon) {
    return respondJSON(request, response, 404, { message: 'Pokémon not found' });
  }
  const stringPokemon = JSON.stringify(pokemon);
  return respondJSON(request, response, 200, stringPokemon);
};

const getPokeType = (request, response, pokeType) => {
  const pokemon = pokedex.filter((p) => p.type.includes(pokeType));

  if (pokemon.length === 0) {
    return respondJSON(request, response, 404, { message: 'No Pokémon found with this type' });
  }

  const stringPokemon = JSON.stringify(pokemon);
  return respondJSON(request, response, 200, stringPokemon);
};



module.exports = {
  getPokemon,
  getFavorites,
  getTeam,
  getPokeID,
  getPokeName,
  getPokeType,
};
