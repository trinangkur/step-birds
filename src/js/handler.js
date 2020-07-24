const {getAccessToken, fetchGitHubUser, clientId} = require('./oAuthUtil');

const redirectToGitLogin = function(req, res) {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}`
  );
};

const getUserDetails = function(req, res, next) {
  const code = req.query.code;
  getAccessToken(code).then(token => {
    fetchGitHubUser(token).then(json => {
      req.userDetails = json;
      next();
    });
  });
};

const addUser = function(req, res) {
  const {dataStore, sessions} = req.app.locals;
  const details = req.userDetails;
  dataStore.addTweeter(details).then(() => {
    const cookie = sessions.createSession(details.login);
    res.cookie('_SID', cookie);
    res.redirect('/user/home');
  });
};

const postTweet = function(req, res) {
  const {userId, content} = req.body;
  const {dataStore} = req.app.locals;
  const postDetails = {userId, content, type: 'tweet'};
  dataStore
    .postTweet(postDetails)
    .then(() => {
      res.end(JSON.stringify({message: 'successful'}));
    })
    .catch(() => {
      res.end(JSON.stringify({message: 'failed'}));
    });
};

const deleteTweet = function(req, res) {
  const {userId, tweetId} = req.body;
  const {dataStore} = req.app.locals;
  const tweetDetails = {userId, tweetId};
  dataStore
    .deleteTweet(tweetDetails)
    .then(() => {
      res.end(JSON.stringify({message: 'successful'}));
    })
    .catch(() => {
      res.end(JSON.stringify({message: 'failed'}));
    });
};

module.exports = {
  redirectToGitLogin,
  getUserDetails,
  postTweet,
  deleteTweet,
  addUser
};
