const request = require('supertest');
const {getDB} = require('../config');
const {DataStore} = require('../src/models/datastore');
const {app} = require('../src/js/app');
const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(getDB());

describe('postTweet', () => {
  it('should be able to post a new tweet', done => {
    const body = JSON.stringify({content: 'new tweet', userId: 'revathi'});
    const expected = {message: 'successful'};
    const expectedJson = JSON.stringify(expected);
    app.locals.dataStore = new DataStore(db);
    request(app)
      .post('/postTweet')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200)
      .expect(expectedJson, done);
  });
});

describe('deleteTweet', () => {
  it('should be able to delete a new tweet', done => {
    const body = JSON.stringify({tweetId: '1', userId: 'revathi'});
    const expected = {message: 'successful'};
    const expectedJson = JSON.stringify(expected);
    app.locals.dataStore = new DataStore(db);
    request(app)
      .post('/deleteTweet')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200)
      .expect(expectedJson, done);
  });
});
