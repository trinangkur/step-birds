const sqlite3 = require('sqlite3');
const request = require('supertest');

const {app} = require('../src/js/app');
const {DataStore} = require('../src/models/datastore');
const {getDB} = require('../config');

const db = new sqlite3.Database(getDB());
app.locals.dataStore = new DataStore(db);

const loginInteractor = {clientId: '1234'};
loginInteractor.getAccessToken = () => {
  return new Promise(res => {
    res('12345');
  });
};
loginInteractor.fetchGitHubUser = () => {
  return new Promise(res => {
    res({login: 'abc', avatar_url: 'https://url', name: 'name'});
  });
};

app.locals.loginInteractor = loginInteractor;

describe('/', () => {
  it('should redirect to home page', done => {
    request(app)
      .get('/')
      .expect('Location', '/user/home')
      .expect(302, done);
  });
});

describe('/user/home', () => {
  before(() => {
    const sessions = {};
    sessions.createSession = () => '123';
    sessions.getUserId = () => false;
    app.locals.sessions = sessions;
  });
  it('should redirect to login.html', done => {
    request(app)
      .get('/user/home')
      .set('Cookie', 'xyz')
      .expect('Location', '/login.html')
      .expect(302, done);
  });

  it('should serve home page', done => {
    const sessions = {};
    sessions.createSession = () => '123';
    sessions.getUserId = () => 'revathi';
    app.locals.sessions = sessions;
    request(app)
      .get('/user/home')
      .set('Cookie', 'xyz')
      .expect(200, done);
  });
});

describe('login page', () => {
  it('should serve login page when requested for /login.html', done => {
    request(app)
      .get('/login.html')
      .expect(200, done);
  });
});

describe('loginUser', () => {
  it('should serve the user login when requested for /loginUser', done => {
    request(app)
      .get('/loginUser')
      .expect(302)
      .expect(
        'Location',
        'https://github.com/login/oauth/authorize?client_id=1234',
        done
      );
  });
});

describe('verify', () => {
  before(() => {
    const sessions = {};
    sessions.createSession = () => '123';
    sessions.getUserId = () => 'abcd';
    app.locals.sessions = sessions;
  });

  it('should verify user when requested for /verify', done => {
    request(app)
      .get('/verify')
      .expect(302, done);
  });
});
