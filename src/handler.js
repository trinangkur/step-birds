const redirectToGitLogin = function(req, res) {
  const {clientId} = req.app.locals.loginInteractor;
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}`
  );
};

const getUserDetails = function(req, res, next) {
  const code = req.query.code;
  const {loginInteractor} = req.app.locals;
  loginInteractor.getAccessToken(code).then(token => {
    loginInteractor.fetchGitHubUser(token).then(json => {
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

module.exports = {
  redirectToGitLogin,
  getUserDetails,
  addUser
};
