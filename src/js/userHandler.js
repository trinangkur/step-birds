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
  dataStore
    .postTweet(postDetails)
    .then(() => {
      res.end(JSON.stringify({ message: 'successful' }));
    })
    .catch(() => {
      res.end(JSON.stringify({ message: 'failed' }));
    });
};

const deleteTweet = function (req, res) {
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

const getLatestTweet = function (req, res) {
  const { dataStore } = req.app.locals;
  dataStore
    .getLatestTweet(req.userId)
    .then((tweets) => {
      res.end(JSON.stringify({ message: 'successful', tweets }));
    })
    .catch(() => {
      res.end(JSON.stringify({ message: 'failed' }));
    });
};

const searchProfile = function (req, res) {
  const { dataStore } = req.app.locals;
  const { name } = req.body;
  dataStore.getUserProfiles(name).then((profiles) => res.json(profiles));
};

module.exports = {
  authorizeUser,
  postTweet,
  deleteTweet,
  searchProfile,
  getLatestTweet,
};
