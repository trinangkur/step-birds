const authorizeUser = function(req, res, next) {
  const { sessions } = req.app.locals;
  const userId = sessions.getUserId(req.cookies._SID);
  if (userId) {
    req.userId = userId;
    return next();
  }
  res.redirect('/login.html');
};

module.exports = { authorizeUser };
