const express = require('express');
const {
  authorizeUser,
  postTweet,
  deleteTweet,
  getLatestTweet,
  searchProfile,
  serveProfile,
  serveUserTweets,
  serveHome,
  redirectUserProfile,
  updateLikes,
  toggleFollow,
  serveAllTweets,
} = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);

userRouter.get('/home', serveHome);

userRouter.post('/searchProfile', searchProfile);

userRouter.get('/profile/:userId', serveProfile);

userRouter.get('/showProfile', redirectUserProfile);

userRouter.post('/postTweet', postTweet);

userRouter.post('/deleteTweet', deleteTweet);

userRouter.get('/getLatestTweet', getLatestTweet);

userRouter.post('/getUserTweets', serveUserTweets);

userRouter.post('/updateLikes', updateLikes);

userRouter.post('/toggleFollowRequest', toggleFollow);

userRouter.get('/getAllTweets', serveAllTweets);

module.exports = { userRouter };
