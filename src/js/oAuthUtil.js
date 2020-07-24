const fetch = require('node-fetch');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const getAccessToken = function(code) {
  return new Promise((resolve) => {
    fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })
      .then((res) => res.text())
      .then((text) => new URLSearchParams(text).get('access_token'))
      .then(resolve);
  });
};

const fetchGitHubUser = function(token) {
  return new Promise((resolve) => {
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: 'token ' + token,
      },
    })
      .then((res) => res.json())
      .then(resolve);
  });
};

module.exports = { getAccessToken, fetchGitHubUser, clientId };
