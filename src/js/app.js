const express = require('express');
const cookieParser = require('cookie-parser');
const { redirectToGitLogin, getUserDetails, addUser } = require('./handler');
const { userRouter } = require('./userRouter');

const app = express();

app.set('view engine', 'pug');
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

app.use('/user', userRouter);

app.get('/login.html', (req, res) => {
  res.render('login', {});
});

app.get('/loginUser', redirectToGitLogin);

app.get('/verify', getUserDetails, addUser);

module.exports = { app };
