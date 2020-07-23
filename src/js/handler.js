const fetch = require('node-fetch');
require('dotenv').config();

// eslint-disable-next-line no-process-env
const clientId = process.env.CLIENT_ID;
// eslint-disable-next-line no-process-env
const clientSecret = process.env.CLIENT_SECRET;

const redirectToGitLogin = function(req, res) {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}`
  );
};

const getAccessToken = function(code) {
  return new Promise(resolve => {
    fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // eslint-disable-next-line camelcase
        client_id: clientId,
        // eslint-disable-next-line camelcase
        client_secret: clientSecret,
        code
      })
    })
      .then(res => res.text())
      .then(text => new URLSearchParams(text).get('access_token'))
      .then(resolve);
  });
};
const fetchGitHubUser = function(token) {
  return new Promise(resolve => {
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: 'token ' + token
      }
    })
      .then(res => res.json())
      .then(resolve);
  });
};

const getUserDetails = function(req, res) {
  const code = req.query.code;
  getAccessToken(code).then(token => {
    fetchGitHubUser(token).then(json => res.json(json));
  });
};

module.exports = {redirectToGitLogin, getUserDetails};
