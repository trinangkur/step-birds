const express = require('express');
const {authorizeUser, postTweet, deleteTweet} = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);
userRouter.get('/home', (req, res) => {
  res.render('home', {});
  res.end();
});

userRouter.post('/postTweet', postTweet);

userRouter.post('/deleteTweet', deleteTweet);

module.exports = {userRouter};
