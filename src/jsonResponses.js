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
  const responseJSON = {
    message: 'Pokémon not found',
  };
  const pokemon = pokedex.find((p) => p.id === parseInt(pokeID, 10));

  if (!pokemon) {
    return respondJSON(request, response, 404, responseJSON);
  }
  responseJSON.message = JSON.stringify(pokemon);
  return respondJSON(request, response, 200, responseJSON);
};

const getPokeName = (request, response, pokeName) => {
  const pokemon = pokedex.find((p) => p.name === pokeName);
  const responseJSON = {
    message: 'Pokémon not found',
  };

  if (!pokemon) {
    return respondJSON(request, response, 404, responseJSON);
  }
  responseJSON.message = JSON.stringify(pokemon);
  return respondJSON(request, response, 200, responseJSON);
};

const getPokeType = (request, response, pokeType) => {
  const pokemon = pokedex.filter((p) => p.type.includes(pokeType));
  const responseJSON = {
    message: 'No Pokémon found with this type',
  };

  if (pokemon.length === 0) {
    return respondJSON(request, response, 404, responseJSON);
  }

  responseJSON.message = JSON.stringify(pokemon);
  return respondJSON(request, response, 200, responseJSON);
};

const addFavorite = (request, response) => {
  const responseJSON = {
    message: 'Please enter a valid Pokémon',
  };

  const { pokemon } = request.body;

  if (!pokemon) {
    responseJSON.id = 'missingParam';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (!favorites[pokemon]) {
    favorites[pokemon] = pokedex.find((p) => p.name === pokemon);
    responseJSON.message = `${pokemon} has been added to favorites!`;
    console.log(favorites);
    return respondJSON(request, response, 201, responseJSON);
  }

  responseJSON.message = `${pokemon} is already in favorites!`;
  return respondJSON(request, response, 204, responseJSON);
};

const buildTeam = (request, response) => {
  const responseJSON = {
    message: 'Please enter a valid Pokémon',
  };
  const { pokemon } = request.body;

  if (!pokemon) {
    responseJSON.id = 'missingParam';
    return respondJSON(request, response, 400, responseJSON);
  }

  console.log(Object.keys(team).length);
  if (!team[pokemon] && Object.keys(team).length < 6) {
    team[pokemon] = pokedex.find((p) => p.name === pokemon);
    responseJSON.message = `${pokemon} has been added to your team!`;
    return respondJSON(request, response, 201, responseJSON);
  }
  if (team[pokemon]) {
    responseJSON.message = `${pokemon} is already in favorites!`;
    return respondJSON(request, response, 204, responseJSON);
  }

  responseJSON.message = 'Your team is full!';
  return respondJSON(request, response, 204, responseJSON);
};

module.exports = {
  getPokemon,
  getFavorites,
  getTeam,
  getPokeID,
  getPokeName,
  getPokeType,
  addFavorite,
  buildTeam,
};
