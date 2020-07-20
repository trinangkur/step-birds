const express = require('express');
const app = express();

app.get('/', (request, response) => {
  response.send('<h>Welcome to our page</h>');
  response.end();
});

module.exports = { app };