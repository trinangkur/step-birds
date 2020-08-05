const authorizeUser = function (req, res, next) {
  const { sessions } = req.app.locals;
  const userId = sessions.getUserId(req.cookies._SID);

  if (userId) {
    req.userId = userId;
    return next();
  }
  res.redirect('/login.html');
};

const postResponse = function (req, res) {
  const { content, timeStamp, type, reference } = req.body;
  const { dataStore } = req.app.locals;
  const postDetails = {
    userId: req.userId,
    content,
    type,
    timeStamp,
    reference,
  };
  dataStore.postResponse(postDetails).then(() => {
    res.json({ status: true });
  });
};

const deleteTweet = function (req, res) {
  const { tweetId, reference, type } = req.body;
  const { dataStore } = req.app.locals;
  dataStore.deleteTweet(tweetId, reference, type).then(() => {
    res.json({ status: true });
  });
};

const getLatestTweet = function (req, res) {
  const { dataStore } = req.app.locals;

  dataStore.getUserTweets(req.userId, req.userId).then((posts) => {
    const { tweet, reference } = posts[posts.length - 1];
    tweet.isUsersTweet = req.userId === tweet.userId;
    res.json({ tweet, reference });
  });
};

const serveProfile = function (req, res) {
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
          joinedAt: new Date(userInfo.joiningDate).toDateString(),
          followingCount: profileInfo.followingCount,
          followersCount: profileInfo.followersCount,
          userOption: profileInfo.userOption,
          bio: profileInfo.bio,
        });
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
      userUrl: image_url,
      image_url,
      userId: id,
    });
  });
};

const updateLikes = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore
    .updateAction(tweetId, req.userId, 'Likes', 'likeCount')
    .then((isLiked) => {
      res.json({ isLiked });
    });
};

const toggleFollow = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweeter } = req.body;
  dataStore.toggleFollow(tweeter, req.userId).then((status) => {
    res.json({ status });
  });
};

const serveAllTweets = function (req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getAllTweets(req.userId).then((tweets) => {
    tweets.forEach(({ tweet }) => {
      tweet.isUsersTweet = req.userId === tweet.userId;
    });
    res.json(tweets);
  });
};

const updateProfile = function (req, res) {
  const { dataStore } = req.app.locals;
  const { name, bio } = req.body;
  dataStore.updateProfile(req.userId, name, bio).then(() => {
    res.json({ status: true });
  });
};

const serveFollowPage = function (req, res) {
  const { dataStore } = req.app.locals;
  const { listName, id } = req.params;
  dataStore.getFollow(listName, id).then((followList) => {
    res.render('follower', { followList, id, listName });
  });
};

const getActivitySpecificTweets = function (req, res) {
  const { id, activity } = req.body;
  req.app.locals.dataStore
    .getActivitySpecificTweets(id, activity, req.userId)
    .then((tweets) => {
      tweets.forEach(({ tweet }) => {
        tweet.isUsersTweet = req.userId === tweet.userId;
      });
      res.json(tweets);
    });
};

const serveTweet = function (req, res) {
  const { dataStore } = req.app.locals;
  dataStore.getUserInfo(req.userId).then(([userInfo]) => {
    dataStore
      .getTweet(req.params.id, req.userId)
      .then(([{ tweet, reference }]) => {
        tweet.isUsersTweet = tweet.userId === req.userId;
        tweet.timeStamp = new Date(tweet.timeStamp).toDateString();
        if (reference) {
          reference.timeStamp = new Date(reference.timeStamp).toDateString();
        }
        res.render('tweet', {
          tweet,
          userId: userInfo.id,
          userUrl: userInfo.image_url,
          reference,
        });
      });
  });
};

const getLikedBy = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.getActionBy(tweetId, 'Likes').then((tweeters) => {
    res.json(tweeters);
  });
};

const getRetweetedBy = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.getActionBy(tweetId, 'Retweets').then((tweeters) => {
    res.json(tweeters);
  });
};

const serveReplies = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore.getReplies(tweetId).then((replies) => {
    replies.forEach((reply) => {
      reply.isUsersTweet = reply.userId === req.userId;
    });
    res.json(replies);
  });
};

const updateRetweets = function (req, res) {
  const { dataStore } = req.app.locals;
  const { tweetId } = req.body;
  dataStore
    .updateAction(tweetId, req.userId, 'Retweets', 'retweetCount')
    .then((isRetweeted) => {
      res.json({ isRetweeted });
    });
};

const searchProfile = function (req, res) {
  const { dataStore } = req.app.locals;
  const { searchBy } = req.params;
  dataStore.getUserProfiles(searchBy).then((profiles) => {
    res.json(profiles);
  });
};

const searchHashtag = function (req, res) {
  const { dataStore } = req.app.locals;
  const { searchBy } = req.params;
  dataStore.searchHashtag(searchBy).then((tweets) => {
    res.json(tweets);
  });
};

module.exports = {
  authorizeUser,
  postResponse,
  deleteTweet,
  searchProfile,
  getLatestTweet,
  serveProfile,
  redirectUserProfile,
  serveHome,
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
  getActivitySpecificTweets,
  searchHashtag,
};
