const express = require('express');
const { authorizeUser } = require('./userHandler');

const userRouter = express.Router();
userRouter.use(authorizeUser);
userRouter.get('/home', (req, res) => {
  res.write(`<h1>Welcome to home page ${req.userId}</h1>`);
  res.end();
});

module.exports = { userRouter };
