const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 8000;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/', (req, res) => {
  res.send('testing github auth');
});

app.get('/login', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}`
  );
});

const getAccessToken = function (code) {
  return new Promise((resolve, rej) => {
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

const fetchGitHubUser = function (token) {
  return new Promise((resolve, rej) => {
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: 'token ' + token,
      },
    })
      .then((res) => res.json())
      .then(resolve);
  });
};

app.get('/user', (req, res) => {
  console.log(req.url);
  const code = req.query.code;
  console.log(code);
  getAccessToken(code).then((token) => {
    console.log(token);
    fetchGitHubUser(token).then((json) => res.json(json));
  });
});

app.listen(port, () => console.log(`listening on ${port}`));
