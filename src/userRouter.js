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
  updateProfile,
  serveFollowers,
  serveFollowings,
  getLikedTweets,
  serveTweet,
  getLikedBy,
  serveRepliedTweet,
  serveReplies,
  postReply,
  updateRetweets,
  getRetweetedTweets,
  getRetweetedBy,
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

userRouter.post('/updateProfile', updateProfile);

userRouter.get('/followers/:id', serveFollowers);

userRouter.get('/followings/:id', serveFollowings);

userRouter.post('/getLikedTweets', getLikedTweets);

userRouter.post('/getRetweetedTweets', getRetweetedTweets);

userRouter.get('/tweet/:id', serveTweet);

userRouter.post('/getLikedBy', getLikedBy);

userRouter.post('/getRetweetedBy', getRetweetedBy);

userRouter.post('/postReply', postReply);

userRouter.post('/getReplies', serveReplies);

userRouter.post('/getRepliedTweets', serveRepliedTweet);

userRouter.post('/updateRetweets', updateRetweets);

module.exports = { userRouter };
