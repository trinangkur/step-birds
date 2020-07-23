const express = require('express');

const { redirectToGitLogin, getUserDetails } = require('./handler');

const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendStatus(200);
  res.end();
});

app.get('/login.html', (req, res) => {
  res.render('login', {});
});

app.get('/loginUser', redirectToGitLogin);

app.get('/user', getUserDetails);

module.exports = { app };
