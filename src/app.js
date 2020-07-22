const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.sendStatus(200);
  res.end();
});

module.exports = { app };
