const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    handler(request, response);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addFavorite') {
    parseBody(request, response, jsonHandler.addFavorite);
  }
  if (parsedUrl.pathname === '/buildTeam') {
    parseBody(request, response, jsonHandler.buildTeam);
  }
};

const handleGet = (request, response, parsedUrl) => {
  console.log(parsedUrl.pathname);

  const urlParts = parsedUrl.pathname.split('/').filter(Boolean);

  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/pokemon') {
    jsonHandler.getPokemon(request, response);
  } else if (parsedUrl.pathname === '/favorites') {
    jsonHandler.getFavorites(request, response);
  } else if (parsedUrl.pathname === '/team') {
    jsonHandler.getTeam(request, response);
  } else if (urlParts[0] === 'pokemon') {
    if (urlParts[1] === 'id' && urlParts.length === 3) {
      const pokeID = urlParts[2];
      jsonHandler.getPokeID(request, response, pokeID);
    } else if (urlParts[1] === 'name' && urlParts.length === 3) {
      const pokeName = urlParts[2];
      jsonHandler.getPokeName(request, response, pokeName);
    } else if (urlParts[1] === 'type' && urlParts.length === 3) {
      const pokeType = urlParts[2];
      jsonHandler.getPokeType(request, response, pokeType);
    }
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
