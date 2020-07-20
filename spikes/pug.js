const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/home', (req, res) => {
  res.render('home', {
    title: 'explore-pug',
    message: 'have fun',
    user: 'world'
  });
});

app.listen(3000, () => {
  console.log('listening on 3000 port');
});
