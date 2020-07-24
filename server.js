const { app } = require('./src/js/app');
const { db } = require('./src/js/database');
const { DataStore } = require('./src/models/datastore');
const { Sessions } = require('./src/models/sessions');

app.locals.sessions = new Sessions();
app.locals.dataStore = new DataStore(db);

app.listen(8000, () => console.log('listening to port 8000'));
