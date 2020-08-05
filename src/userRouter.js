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
  serveReplies,
  updateRetweets,
  getRetweetedBy,
  searchHashtag,
  getActivitySpecificTweets,
  getMatchingTags,
} = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);

userRouter.get('/home', serveHome);

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

userRouter.post('/updateRetweets', updateRetweets);

userRouter.get('/searchProfile/:searchBy', searchProfile);

userRouter.get('/searchHashtag/:searchBy', searchHashtag);

userRouter.get('/serveHashtag/:searchBy', getMatchingTags);

module.exports = { userRouter };
