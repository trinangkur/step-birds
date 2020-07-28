const authorizeUser = function (req, res, next) {
  const { sessions } = req.app.locals;
  const userId = sessions.getUserId(req.cookies._SID);

  if (userId) {
    req.userId = userId;
    return next();
  }
  res.redirect('/login.html');
};

const postTweet = function (req, res) {
  const { content } = req.body;
  const { dataStore } = req.app.locals;
  const postDetails = { userId: req.userId, content, type: 'tweet' };
  dataStore.postTweet(postDetails).then(() => {
    res.end(JSON.stringify({ message: 'successful' }));
  });
};

const deleteTweet = function (req, res) {
  const { tweetId } = req.body;
  const { dataStore } = req.app.locals;
  const tweetDetails = { userId: req.userId, tweetId };
  dataStore.deleteTweet(tweetDetails).then(() => {
    res.end(JSON.stringify({ message: 'successful' }));
  });
};

const getLatestTweet = function (req, res) {
  const { dataStore } = req.app.locals;

  dataStore.getUserTweets(req.userId, req.userId).then((tweets) => {
    const tweet = tweets[tweets.length - 1];
    tweet.isUsersTweet = req.userId === tweet.user_id;

    res.end(
      JSON.stringify({
        message: 'successful',
        tweet,
      })
    );
  });
};

const searchProfile = function (req, res) {
  const { dataStore } = req.app.locals;
  const { name } = req.body;
  dataStore.getUserProfiles(name).then((profiles) => {
    res.json(profiles);
  });
};

const serveProfile = function (req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getUserInfo(req.userId).then(([userInfo]) => {
    dataStore
      .getProfileInfo(req.params.userId, req.userId)
      .then(([profileInfo]) => {
        res.render('profile', {
          profileUrl: profileInfo.image_url,
          profile: profileInfo.name,
          id: profileInfo.id,
          userId: userInfo.id,
          userUrl: userInfo.image_url,
          joinedAt: userInfo.joiningDate,
          followingCount: profileInfo.followingCount,
          followersCount: profileInfo.followersCount,
          userOption: profileInfo.userOption,
        });
      });
  });
};

const serveUserTweets = function (req, res) {
  req.app.locals.dataStore
    .getUserTweets(req.body.id, req.userId)
    .then((tweets) => {
      tweets.forEach((tweet) => {
        tweet.isUsersTweet = req.userId === tweet.user_id;
      });

      res.json({
        message: 'successful',
        tweets,
      });
    });
};

const redirectUserProfile = function (req, res) {
  res.redirect(`/user/profile/${req.userId}`);
};

const serveHome = function (req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getUserInfo(req.userId).then((userInfo) => {
    const { image_url, id } = userInfo[0];
    res.render('home', {
      title: 'Twitter',
      image_url,
      userId: id,
    });
    res.end();
  });
};

const updateLikes = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.updateLikes(tweetId, req.userId).then((message) => {
    res.json({ message });
  });
};

const toggleFollow = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweeter } = req.body;
  dataStore.toggleFollow(tweeter, req.userId).then((status) => {
    res.json({ message: 'successful', status });
  });
};

const serveAllTweets = function (req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getAllTweets(req.userId).then((tweets) => {
    tweets.forEach((tweet) => {
      tweet.isUsersTweet = req.userId === tweet.userId;
    });
    res.json(tweets);
  });
};

module.exports = {
  authorizeUser,
  postTweet,
  deleteTweet,
  searchProfile,
  getLatestTweet,
  serveProfile,
  serveUserTweets,
  redirectUserProfile,
  serveHome,
  updateLikes,
  toggleFollow,
  serveAllTweets,
};
