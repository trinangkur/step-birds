const express = require('express');
const {
  authorizeUser,
  postTweet,
  deleteTweet,
  getLatestTweet,
  searchProfile,
  getUserInfo,
  serveProfile,
  serveUserTweets,
  redirectUserProfile
} = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);
userRouter.get('/home', (req, res) => {
  const {dataStore} = req.app.locals;
  dataStore.getUserInfo(req.userId).then(userInfo => {
    const {image_url, id} = userInfo[0];
    res.render('home', {
      title: 'Twitter',
      image_url,
      displayTweet: `getAllTweets("${id}")`
    });
    res.end();
  });
});

userRouter.post('/searchProfile', searchProfile);

userRouter.get('/profile/:userId', serveProfile);

userRouter.get('/showProfile', redirectUserProfile);

userRouter.post('/postTweet', postTweet);

userRouter.post('/deleteTweet', deleteTweet);

userRouter.get('/getLatestTweet', getLatestTweet);

userRouter.get('/getUserInfo', getUserInfo);

userRouter.post('/getUserTweets', serveUserTweets);

module.exports = {userRouter};
