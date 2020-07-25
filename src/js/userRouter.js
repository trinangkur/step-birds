const express = require('express');
const {
  authorizeUser,
  postTweet,
  deleteTweet,
  getLatestTweet,
  searchProfile,
} = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);
userRouter.get('/home', (req, res) => {
  res.render('home', {});
  res.end();
});

userRouter.post('/searchProfile', searchProfile);

userRouter.post('/postTweet', postTweet);

userRouter.post('/deleteTweet', deleteTweet);

userRouter.get('/getLatestTweet', getLatestTweet);

module.exports = { userRouter };
