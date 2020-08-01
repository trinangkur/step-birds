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
  const { content, timeStamp, type } = req.body;
  const { dataStore } = req.app.locals;
  const postDetails = {
    userId: req.userId,
    content,
    type,
    timeStamp,
    reference: null,
  };
  dataStore.postTweet(postDetails).then(() => {
    res.json({ status: true });
  });
};

const deleteTweet = function(req, res) {
  const { tweetId, reference, type } = req.body;
  const { dataStore } = req.app.locals;
  dataStore.deleteTweet(tweetId, reference, type).then(() => {
    res.json({ status: true });
  });
};

const getLatestTweet = function(req, res) {
  const { dataStore } = req.app.locals;

  dataStore.getUserTweets(req.userId, req.userId).then((tweets) => {
    const tweet = tweets[tweets.length - 1];
    tweet.isUsersTweet = req.userId === tweet.userId;
    res.json(tweet);
  });
};

const searchProfile = function(req, res) {
  const { dataStore } = req.app.locals;
  const { name } = req.body;
  dataStore.getUserProfiles(name).then((profiles) => {
    res.json(profiles);
  });
};

const serveProfile = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getUserInfo(req.userId).then(([userInfo]) => {
    dataStore
      .getProfileInfo(req.params.userId, req.userId)
      .then(([profileInfo]) => {
        res.render('profile', {
          image_url: profileInfo.image_url,
          profile: profileInfo.name,
          id: profileInfo.id,
          userId: userInfo.id,
          userUrl: userInfo.image_url,
          joinedAt: userInfo.joiningDate,
          followingCount: profileInfo.followingCount,
          followersCount: profileInfo.followersCount,
          userOption: profileInfo.userOption,
          bio: profileInfo.bio,
        });
      });
  });
};

const serveUserTweets = function(req, res) {
  req.app.locals.dataStore
    .getUserTweets(req.body.id, req.userId)
    .then((tweets) => {
      tweets.forEach((tweet) => {
        tweet.isUsersTweet = req.userId === tweet.userId;
      });
      res.json(tweets);
    });
};

const redirectUserProfile = function(req, res) {
  res.redirect(`/user/profile/${req.userId}`);
};

const serveHome = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getUserInfo(req.userId).then((userInfo) => {
    const { image_url, id } = userInfo[0];
    res.render('home', {
      title: 'Twitter',
      userUrl: image_url,
      image_url,
      userId: id,
    });
  });
};

const updateLikes = function(req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.updateLikes(tweetId, req.userId).then((message) => {
    res.json({ message });
  });
};

const toggleFollow = function(req, res) {
  const { dataStore } = req.app.locals;
  const { tweeter } = req.body;
  dataStore.toggleFollow(tweeter, req.userId).then((status) => {
    res.json({ status });
  });
};

const serveAllTweets = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getAllTweets(req.userId, req.userId).then((tweets) => {
    tweets.forEach((tweet) => {
      tweet.isUsersTweet = req.userId === tweet.userId;
    });
    res.json(tweets);
  });
};

const updateProfile = function(req, res) {
  const { dataStore } = req.app.locals;
  const { name, bio } = req.body;
  dataStore.updateProfile(req.userId, name, bio).then(() => {
    res.json({ status: true });
  });
};

const serveFollowers = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getFollowers(req.params.id).then((followers) => {
    res.render('follower', { followers, userId: req.params.id });
  });
};

const serveFollowings = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getFollowings(req.params.id).then((followings) => {
    res.render('follower', { followings, userId: req.params.id });
  });
};

const getLikedTweets = function(req, res) {
  const { dataStore } = req.app.locals;
  const { id } = req.body;
  dataStore.getLikedTweets(id, req.userId).then((tweets) => {
    tweets.forEach((tweet) => {
      tweet.isUsersTweet = req.userId === tweet.userId;
    });
    res.json(tweets);
  });
};

const getRetweetedTweets = function(req, res) {
  const { dataStore } = req.app.locals;
  const { id } = req.body;
  dataStore.getRetweetedTweets(id, req.userId).then((tweets) => {
    tweets.forEach((tweet) => {
      tweet.isUsersTweet = req.userId === tweet.userId;
    });
    res.json(tweets);
  });
};

const serveTweet = function(req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getUserInfo(req.userId).then(([userInfo]) => {
    dataStore.getTweet(req.params.id, req.userId).then(([tweet]) => {
      tweet.isUsersTweet = tweet.userId === req.userId;
      tweet.timeStamp = new Date(tweet.timeStamp).toLocaleString();
      res.render('tweet', {
        tweet,
        userId: userInfo.id,
        userUrl: userInfo.image_url,
      });
    });
  });
};

const getLikedBy = function(req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.getLikedBy(tweetId).then((tweeters) => {
    res.json(tweeters);
  });
};

const getRetweetedBy = function(req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.getRetweetedBy(tweetId).then((tweeters) => {
    res.json(tweeters);
  });
};

const postReply = function(req, res) {
  const { dataStore } = req.app.locals;
  const { userId } = req;
  const { content, timeStamp, tweetId } = req.body;
  dataStore
    .postReply({ content, timeStamp, tweetId, type: 'reply', userId })
    .then(() => {
      res.json({ status: true });
    });
};

const serveReplies = function(req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.getReplies(tweetId).then((replies) => {
    replies.forEach((reply) => {
      reply.isUsersTweet = reply.userId === req.userId;
    });
    res.json(replies);
  });
};

const serveRepliedTweet = function(req, res) {
  const { dataStore } = req.app.locals;
  const { userId } = req.body;
  dataStore.getRepliedTweet(userId, req.userId).then((tweets) => {
    tweets.forEach((tweet) => {
      tweet.isUsersTweet = tweet.userId === req.userId;
    });
    res.json(tweets);
  });
};

const updateRetweets = function(req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.updateRetweets(tweetId, req.userId).then((isRetweeted) => {
    res.json({ isRetweeted });
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
  updateProfile,
  serveFollowers,
  serveFollowings,
  getLikedTweets,
  serveTweet,
  getLikedBy,
  postReply,
  serveReplies,
  serveRepliedTweet,
  updateRetweets,
  getRetweetedTweets,
  getRetweetedBy,
};
