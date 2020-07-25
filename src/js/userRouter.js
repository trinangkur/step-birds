const express = require('express');
const {
  authorizeUser,
  postTweet,
  deleteTweet,
  getLatestTweet,
  searchProfile,
  getTweets,
  getUserInfo,
  serveProfile,
  serveUserTweets,
  redirectUserProfile
} = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);
userRouter.get('/home', (req, res) => {
  res.render('home', { title: 'Twitter' });
  res.end();
});

userRouter.post('/searchProfile', searchProfile);

userRouter.get('/profile/:userId', serveProfile);

userRouter.get('/showProfile', redirectUserProfile);

userRouter.post('/postTweet', postTweet);

userRouter.post('/deleteTweet', deleteTweet);

userRouter.get('/getLatestTweet', getLatestTweet);

userRouter.get('/getTweets', getTweets);

userRouter.get('/getUserInfo', getUserInfo);

userRouter.post('/getUserTweets', serveUserTweets);

module.exports = { userRouter };
