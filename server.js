const fetch = require('node-fetch');
require('dotenv').config();
const { app } = require('./src/app');
const { db } = require('./src/database');
const { DataStore } = require('./src/models/datastore');
const { Sessions } = require('./src/models/sessions');
const { LoginInteractor } = require('./src/models/loginInteractor');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.locals.sessions = new Sessions();
app.locals.dataStore = new DataStore(db);
app.locals.loginInteractor = new LoginInteractor(clientId, clientSecret, fetch);

app.listen(8000, () => console.log('listening to port 8000'));
