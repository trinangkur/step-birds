const express = require('express');
const cookieParser = require('cookie-parser');
const { userRouter } = require('./userRouter');
const { DataStore } = require('./models/datastore');
const { db } = require('./database');

const { redirectToGitLogin, getUserDetails, addUser } = require('./handler');

const app = express();
app.locals.dataStore = new DataStore(db);

app.set('view engine', 'pug');
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRouter);

app.get('/login.html', (req, res) => {
  res.render('login', {});
});

app.get('/loginUser', redirectToGitLogin);

app.get('/verify', getUserDetails, addUser);

app.get('/', (req, res) => {
  res.redirect('/user/home');
});

module.exports = { app };
