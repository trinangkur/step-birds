const express = require('express');
const userRouter = express.Router();

userRouter.get('/home', (req, res) => {
  res.write('<h1>Welcome to home page</h1>');
  res.end();
});

module.exports = { userRouter };
