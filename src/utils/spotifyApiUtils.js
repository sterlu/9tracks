const fetch = require('node-fetch');

module.exports.accessTokenLink = () => 'https://accounts.spotify.com/api/token';

module.exports.playlistLink = (id) => `https://api.spotify.com/v1/playlists/${id}`;

module.exports.userLink = (id) => `https://api.spotify.com/v1/users/${id}`;

module.exports.getAccessToken = async () => {
  // check db
  const response = await fetch(module.exports.accessTokenLink(), {
    method: 'POST',
    headers: {
      authorization: 'Basic YWFjNmVmNWIyNzFiNGQxNDk3NDRiNmU3YTE1ODlhYzM6YWRkZTBhYzE3ZmIzNGMyN2FmODczNDQ1OWU1ZWM5YWE',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  if (data.error)
    throw new Error(data.error_description);
  // store in db
  return data.access_token;
};
