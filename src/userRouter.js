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

const hasFields = (...fields) => {
  return (req, res, next) => {

    if (fields.every((field) => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

userRouter.use(authorizeUser);

userRouter.get('/home', serveHome);

userRouter.get('/profile/:userId', serveProfile);

userRouter.get('/showProfile', redirectUserProfile);

userRouter.post(
  '/postResponse',
  hasFields('content', 'reference', 'type', 'timeStamp'),
  postResponse
);

userRouter.post(
  '/deleteTweet',
  hasFields('tweetId', 'reference', 'type'),
  deleteTweet
);

userRouter.get('/getLatestTweet', getLatestTweet);

userRouter.post('/updateLikes', hasFields('tweetId'), updateLikes);

userRouter.post('/toggleFollowRequest', hasFields('tweeter'), toggleFollow);

userRouter.get('/getAllTweets', serveAllTweets);

userRouter.post('/updateProfile', hasFields('name', 'bio'), updateProfile);

userRouter.get('/followList/:listName/:id', serveFollowPage);

userRouter.post('/getActivitySpecificTweets', getActivitySpecificTweets);

userRouter.get('/tweet/:id', serveTweet);

userRouter.post('/getLikedBy', hasFields('tweetId'), getLikedBy);

userRouter.post('/getRetweetedBy', hasFields('tweetId'), getRetweetedBy);

userRouter.post('/getReplies', hasFields('tweetId'), serveReplies);

userRouter.post('/updateRetweets', hasFields('tweetId'), updateRetweets);

userRouter.get('/searchProfile/:searchBy', searchProfile);

userRouter.get('/searchHashtag/:searchBy', searchHashtag);

userRouter.get('/serveHashtag/:searchBy', getMatchingTags);

module.exports = { userRouter };
