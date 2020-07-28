const request = require('supertest');
const { getDB } = require('../config');
const { DataStore } = require('../src/models/datastore');
const { app } = require('../src/js/app');
const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(getDB());

describe('postTweet', () => {
  before(() => {
    const sessions = { getUserId: () => 'revathi' };
    app.locals.sessions = sessions;
  });
  it('should be able to post a new tweet', (done) => {
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
  before(() => {
    const sessions = { getUserId: () => 'revathi' };
    app.locals.sessions = sessions;
  });
  it('should be able to delete a new tweet', (done) => {
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

describe('/getLatestTweet', () => {
  before(() => {
    const sessions = { getUserId: () => 'vikram' };
    app.locals.sessions = sessions;
  });
  it('should get all tweets of user', (done) => {
    const expected = {
      message: 'successful',
      tweet: {
        userId: 'vikram',
        name: 'Vikram Singh',
        id: 7,
        content: 'My laptop is broken :(',
        timeStamp: 'someDate',
        likeCount: 0,
        replyCount: 0,
        image_url: 'fakeUrl',
        tweetId: null,
        status: 'false',
        isUsersTweet: false,
      },
    };
    const expectedJson = JSON.stringify(expected);
    request(app)
      .get('/user/getLatestTweet')
      .send({
        userId: 'vikram',
      })
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

describe('showProfile', function () {
  before(() => {
    app.locals.sessions = { getUserId: () => 'revathi' };
  });
  it('should redirect to user profile', function (done) {
    request(app)
      .get('/user/showProfile')
      .expect('Location', '/user/profile/revathi')
      .expect(302, done);
  });
});

describe('getUserTweets', function () {
  before(() => {
    app.locals.sessions = { getUserId: () => 'revathi' };
  });
  const expected = {
    message: 'successful',
    tweets: [
      {
        userId: 'vikram',
        name: 'Vikram Singh',
        id: 7,
        content: 'My laptop is broken :(',
        timeStamp: 'someDate',
        likeCount: 0,
        replyCount: 0,
        image_url: 'fakeUrl',
        tweetId: null,
        status: 'false',
        isUsersTweet: false,
      },
    ],
  };
  it('should get tweets for given user', function (done) {
    request(app)
      .post('/user/getUserTweets')
      .set('Content-Type', 'application/json')
      .send({ id: 'vikram' })
      .expect(expected)
      .expect(200, done);
  });
});

describe('/profile/:profileName', function () {
  before(() => {
    app.locals.sessions = { getUserId: () => 'revathi' };
  });
  it('should get user profile', function (done) {
    request(app).get('/user/profile/revathi').expect(200, done);
  });
});

describe('/profile/:profileName', function () {
  before(() => {
    app.locals.sessions = { getUserId: () => 'revathi' };
  });
  it('should redirect to user profile', function (done) {
    request(app).get('/user/profile/revathi').expect(200, done);
  });
});

describe('updateLikes', function () {
  before(() => {
    app.locals.sessions = { getUserId: () => 'revathi' };
  });
  it('should like the tweet', function (done) {
    request(app)
      .post('/user/updateLikes')
      .set('Content-Type', 'application/json')
      .send({ tweetId: 1, userId: 'revathi' })
      .expect({ message: 'liked' })
      .expect(200, done);
  });

  it('should unLike the post', function (done) {
    request(app)
      .post('/user/updateLikes')
      .set('Content-Type', 'application/json')
      .send({ tweetId: 1, userId: 'revathi' })
      .expect({ message: 'unLiked' })
      .expect(200, done);
  });
});

describe('/toggleFollowRequest', function () {
  before(() => {
    app.locals.sessions = { getUserId: () => 'revathi' };
  });
  it('should be add user as a follower of particular tweeter', (done) => {
    app.locals.dataStore = new DataStore(db);
    const expected = { message: 'successful', status: 'followed' };
    request(app)
      .post('/user/toggleFollowRequest')
      .set('Content-Type', 'application/json')
      .send({ tweeter: 'vikram' })
      .expect(200)
      .expect(expected, done);
  });

  it('should unfollow a particular tweeter', (done) => {
    app.locals.dataStore = new DataStore(db);
    const expected = { message: 'successful', status: 'unFollowed' };
    request(app)
      .post('/user/toggleFollowRequest')
      .set('Content-Type', 'application/json')
      .send({ tweeter: 'vikram' })
      .expect(200)
      .expect(expected, done);
  });
});
