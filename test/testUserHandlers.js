const request = require('supertest');
const { getDB } = require('../config');
const { DataStore } = require('../src/models/datastore');
const { app } = require('../src/js/app');
const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(getDB());

describe('postTweet', () => {
  it('should be able to post a new tweet', (done) => {
    before(() => {
      const sessions = { getUserId: () => 'revathi' };
      app.locals.sessions = sessions;
    });
    app.locals.dataStore = new DataStore(db);
    const body = JSON.stringify({ content: 'new tweet' });
    const expected = { message: 'successful' };
    const expectedJson = JSON.stringify(expected);
    request(app)
      .post('/user/postTweet')
      .set('Content-Type', 'application/json')
      .send({ body, userId: 'revathi' })
      .expect(200)
      .expect(expectedJson, done);
  });
});

describe('deleteTweet', () => {
  it('should be able to delete a new tweet', (done) => {
    before(() => {
      const sessions = { getUserId: () => 'revathi' };
      app.locals.sessions = sessions;
    });
    const body = JSON.stringify({ tweetId: '1' });
    const expected = { message: 'successful' };
    const expectedJson = JSON.stringify(expected);
    request(app)
      .post('/user/deleteTweet')
      .set('Content-Type', 'application/json')
      .send({ body, userId: 'revathi' })
      .expect(200)
      .expect(expectedJson, done);
  });
});

describe('searchProfile', function () {
  before(() => {
    app.locals.sessions = { getUserId: () => 'revathi' };
  });
  it('should serve searchProfile', function (done) {
    request(app)
      .post('/user/searchProfile')
      .set('Content-Type', 'application/json')
      .send({ name: 'rahit' })
      .expect([
        { id: 'rahit', name: 'Rahit Kar', image_url: 'fakeUrl' },
        { id: 'rahitkar', name: 'Rahit Kar', image_url: 'fakeUrl' },
      ])
      .expect(200, done);
  });
});
