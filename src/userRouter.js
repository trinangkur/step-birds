const express = require('express');
const {
  authorizeUser,
  postResponse,
  deleteTweet,
  getLatestTweet,
  searchProfile,
  serveProfile,
  serveHome,
  redirectUserProfile,
  updateLikes,
  toggleFollow,
  serveAllTweets,
  updateProfile,
  serveFollowPage,
  serveTweet,
  getLikedBy,
  serveRepliedTweet,
  serveReplies,
  updateRetweets,
  getRetweetedBy,
  getActivitySpecificTweets,
  searchHashtag,
  getLatestRetweet,
} = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);

userRouter.get('/home', serveHome);

userRouter.post('/searchProfile', searchProfile);

userRouter.get('/profile/:userId', serveProfile);

userRouter.get('/showProfile', redirectUserProfile);

userRouter.post('/postResponse', postResponse);

userRouter.post('/deleteTweet', deleteTweet);

userRouter.get('/getLatestTweet', getLatestTweet);

userRouter.post('/updateLikes', updateLikes);

userRouter.post('/toggleFollowRequest', toggleFollow);

userRouter.get('/getAllTweets', serveAllTweets);

userRouter.post('/updateProfile', updateProfile);

userRouter.get('/followList/:listName/:id', serveFollowPage);

userRouter.post('/getActivitySpecificTweets', getActivitySpecificTweets);

userRouter.get('/tweet/:id', serveTweet);

userRouter.post('/getLikedBy', getLikedBy);

userRouter.post('/getRetweetedBy', getRetweetedBy);

userRouter.post('/getReplies', serveReplies);

userRouter.post('/getRepliedTweets', serveRepliedTweet);

userRouter.post('/updateRetweets', updateRetweets);

userRouter.post('/searchHashtag', searchHashtag);

userRouter.get('/getLatestRetweet', getLatestRetweet);

module.exports = { userRouter };
