const sqlite3 = require('sqlite3');
const request = require('supertest');

const { app } = require('../src/js/app');
const { DataStore } = require('../src/models/datastore');
const { getDB } = require('../config');

const db = new sqlite3.Database(getDB());
app.locals.dataStore = new DataStore(db);
const sessions = {};
sessions.createSession = () => '123';
sessions.getUser = () => 'abcd';
app.locals.sessions = sessions;
app.locals.loginInteractor = { clintId: '1234' };

describe('login page', () => {
  it('should serve login page when requested for /login.html', (done) => {
    request(app)
      .get('/login.html')
      .expect(200, done);
  });
});
describe('loginUser', () => {
  it('should serve the user login when requested for /loginUser', (done) => {
    request(app)
      .get('/loginUser')
      .expect(302, done);
  });
});
