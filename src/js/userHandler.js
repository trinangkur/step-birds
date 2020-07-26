const authorizeUser = function(req, res, next) {
  const { sessions } = req.app.locals;
  const userId = sessions.getUserId(req.cookies._SID);

  if (userId) {
    req.userId = userId;
    return next();
  }
  res.redirect('/login.html');
};

const postTweet = function(req, res) {
  const { content } = req.body;
  const { dataStore } = req.app.locals;
  const postDetails = { userId: req.userId, content, type: 'tweet' };
  dataStore
    .postTweet(postDetails)
    .then(() => {
      res.end(JSON.stringify({ message: 'successful' }));
    })
    .catch(() => {
      res.end(JSON.stringify({ message: 'failed' }));
    });
};

const deleteTweet = function(req, res) {
  const { tweetId } = req.body;
  const { dataStore } = req.app.locals;
  const tweetDetails = { userId: req.userId, tweetId };
  dataStore
    .deleteTweet(tweetDetails)
    .then(() => {
      res.end(JSON.stringify({ message: 'successful' }));
    })
    .catch(() => {
      res.end(JSON.stringify({ message: 'failed' }));
    });
};

const getLatestTweet = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore
    .getLatestTweet(req.userId)
    .then((tweets) => {
      res.end(JSON.stringify({ message: 'successful', tweet: tweets[0] }));
    })
    .catch(() => {
      res.end(JSON.stringify({ message: 'failed' }));
    });
};

const getTweets = function(req, res) {
  const { dataStore } = req.app.locals;

  dataStore
    .getTweets(req.userId)
    .then((tweets) => {
      res.end(JSON.stringify({ message: 'successful', tweets }));
    })
    .catch(() => {
      res.end(JSON.stringify({ message: 'failed' }));
    });
};

const searchProfile = function(req, res) {
  const { dataStore } = req.app.locals;
  const { name } = req.body;
  dataStore.getUserProfiles(name).then((profiles) => {
    res.json(profiles);
  });
};

const getUserInfo = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore
    .getUserInfo(req.userId)
    .then((userInfo) => {
      res.end(JSON.stringify({ message: 'successful', userInfo }));
    })
    .catch(() => {
      res.end(JSON.stringify({ message: 'failed' }));
    });
};

const serveProfile = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getUserInfo(req.params.userId).then(([profileInfo]) => {
    dataStore.getUserInfo(req.userId).then(([userInfo]) => {
      res.render('profile', {
        profileUrl: profileInfo.image_url,
        profile: profileInfo.name,
        id: profileInfo.id,
        userId: userInfo.id,
        userUrl: userInfo.image_url,
      });
    });
  });
};

const serveUserTweets = function(req, res) {
  req.app.locals.dataStore.getUserTweets(req.body.id).then((tweets) => {
    tweets.forEach((tweet) => {
      tweet.isUsersTweet = req.userId === tweet.userId;
    });
    
    res.json({
      message: 'successful',
      tweets,
    });
  });
};

const redirectUserProfile = function(req, res) {
  res.redirect(`/user/profile/${req.userId}`);
};

module.exports = {
  authorizeUser,
  postTweet,
  deleteTweet,
  searchProfile,
  getLatestTweet,
  getTweets,
  getUserInfo,
  serveProfile,
  serveUserTweets,
  redirectUserProfile,
};
