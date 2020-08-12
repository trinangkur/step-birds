const request = require('supertest');
const {DataStore} = require('../src/models/datastore');
const {app} = require('../src/app');
const config = require('../knexfile');
const db = require('knex')(config.test);
const expected = require('./expectedData.json');

describe('/postResponse', () => {
  before(() => {
    const sessions = {getUserId: () => 'revathi'};
    app.locals.sessions = sessions;
  });
  it('should be able to post a new tweet', done => {
    app.locals.dataStore = new DataStore(db);
    const body = {
      content: 'new tweet',
      timeStamp: 'fake time',
      type: 'tweet',
      reference: null
    };
    request(app)
      .post('/user/postResponse')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect({status: true})
      .expect(200, done);
  });

  it('should give 400 status code for wrong parameters', done => {
    app.locals.dataStore = new DataStore(db);
    request(app)
      .post('/user/postResponse')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400, done);
  });
});

describe('/deleteTweet', () => {
  before(() => {
    const sessions = {getUserId: () => 'revathi'};
    app.locals.sessions = sessions;
  });
  it('should be able to delete a new tweet', done => {
    request(app)
      .post('/user/deleteTweet')
      .set('Content-Type', 'application/json')
      .send({tweetId: 1, type: 'tweet', reference: null})
      .expect({status: true})
      .expect(200, done);
  });
});

describe('/getLatestTweet', () => {
  before(() => {
    const sessions = {getUserId: () => 'vikram'};
    app.locals.sessions = sessions;
  });
  it('should get all tweets of user', done => {
    request(app)
      .get('/user/getLatestTweet')
      .send({userId: 'vikram'})
      .expect(200)
      .expect(expected.latestTweet, done);
  });
});

describe('searchProfile', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should serve searchProfile', function(done) {
    request(app)
      .get('/user/searchProfile/rahit')
      .set('Content-Type', 'application/json')
      .expect(expected.profiles)
      .expect(200, done);
  });
});

describe('showProfile', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should redirect to user profile', function(done) {
    request(app)
      .get('/user/showProfile')
      .expect('Location', '/user/profile/revathi')
      .expect(302, done);
  });
});

describe('/profile/:profileName', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should get user profile', function(done) {
    request(app)
      .get('/user/profile/revathi')
      .expect(200, done);
  });
});

describe('/profile/:profileName', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should redirect to user profile', function(done) {
    request(app)
      .get('/user/profile/revathi')
      .expect(200, done);
  });
});

describe('updateLikes', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should like the tweet', function(done) {
    request(app)
      .post('/user/updateLikes')
      .set('Content-Type', 'application/json')
      .send({tweetId: 4, userId: 'revathi'})
      .expect({isLiked: true})
      .expect(200, done);
  });

  it('should unLike the post', function(done) {
    request(app)
      .post('/user/updateLikes')
      .set('Content-Type', 'application/json')
      .send({tweetId: 4, userId: 'revathi'})
      .expect({isLiked: false})
      .expect(200, done);
  });
});

describe('/toggleFollowRequest', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should be add user as a follower of particular tweeter', done => {
    app.locals.dataStore = new DataStore(db);
    request(app)
      .post('/user/toggleFollowRequest')
      .set('Content-Type', 'application/json')
      .send({tweeter: 'vikram'})
      .expect(200)
      .expect({status: true}, done);
  });

  it('should unfollow a particular tweeter', done => {
    app.locals.dataStore = new DataStore(db);
    request(app)
      .post('/user/toggleFollowRequest')
      .set('Content-Type', 'application/json')
      .send({tweeter: 'vikram'})
      .expect(200)
      .expect({status: false}, done);
  });
});

describe('/getAllTweets', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should get tweets for given user', function(done) {
    request(app)
      .get('/user/getAllTweets')
      .expect(expected.getAllTweets)
      .expect(200, done);
  });
});

describe('/user/postResponse', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });

  it('should post a reply', function(done) {
    const body = {
      content: 'nice reply',
      timeStamp: 'oneTimeStamp',
      reference: 7,
      type: 'reply'
    };
    request(app)
      .post('/user/postResponse')
      .send(body)
      .expect({status: true})
      .expect(200, done);
  });
});

describe('/deleteTweet', () => {
  before(() => {
    const sessions = {getUserId: () => 'revathi'};
    app.locals.sessions = sessions;
  });
  it('should be able to delete a reply', done => {
    request(app)
      .post('/user/deleteTweet')
      .set('Content-Type', 'application/json')
      .send({tweetId: 13, type: 'reply', reference: null})
      .expect({status: true})
      .expect(200, done);
  });
});

describe('/user/getReplies', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should get reply of a given tweet id', function(done) {
    request(app)
      .post('/user/getReplies')
      .send({tweetId: 7})
      .expect(expected.getReplies)
      .expect(200, done);
  });
});

describe('/user/updateProfile', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should post a reply', function(done) {
    const body = {
      name: 'viky',
      bio: 'it is your life make it large'
    };
    request(app)
      .post('/user/updateProfile')
      .send(body)
      .expect({status: true})
      .expect(200, done);
  });
});

describe('/user/getLikedBy', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should get the list of user who liked the tweet', function(done) {
    request(app)
      .post('/user/getLikedBy')
      .send({tweetId: 7})
      .expect(expected.getLikedBy)
      .expect(200, done);
  });
});

describe('/followList/:listName/:id', () => {
  before(() => {
    app.locals.sessions = {getUserId: () => 'ramu'};
  });
  it('should give the list of follower of user', done => {
    request(app)
      .get('/user/followList/follower/ramu')
      .expect(/vikram/)
      .expect(200, done);
  });

  it('should give the list of user whom user is following', done => {
    request(app)
      .get('/user/followList/following/vikram')
      .expect(/ramu/)
      .expect(200, done);
  });
});

describe('/getActivitySpecificTweets', () => {
  before(() => {
    app.locals.sessions = {getUserId: () => 'ramu'};
  });
  it('should give all the tweets of user', done => {
    request(app)
      .post('/user/getActivitySpecificTweets')
      .send({id: 'vikram', activity: 'tweets'})
      .expect(200)
      .expect(expected.getAllUserSpecificTweet, done);
  });

  it('should give all the tweets of which user Liked', done => {
    request(app)
      .post('/user/getActivitySpecificTweets')
      .send({id: 'vikram', activity: 'likes'})
      .expect(200)
      .expect(expected.getAllUserLikedTweet, done);
  });
});

describe('/user/getRetweetedBy', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should get the list of user who retweeted the tweet', function(done) {
    request(app)
      .post('/user/getRetweetedBy')
      .send({tweetId: 10})
      .expect(expected.getRetweetedBy)
      .expect(200, done);
  });
});

describe('updateRetweets', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should retweet the tweet', function(done) {
    request(app)
      .post('/user/updateRetweets')
      .set('Content-Type', 'application/json')
      .send({tweetId: 4, userId: 'revathi'})
      .expect({isRetweeted: true})
      .expect(200, done);
  });

  it('should undo the retweet', function(done) {
    request(app)
      .post('/user/updateRetweets')
      .set('Content-Type', 'application/json')
      .send({tweetId: 4, userId: 'revathi'})
      .expect({isRetweeted: false})
      .expect(200, done);
  });
});
describe('searchHashTag', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'ramu'};
  });
  it('should be able to post a new tweet', done => {
    app.locals.dataStore = new DataStore(db);
    const details = {
      content: 'new tweet #goodTweet',
      timeStamp: 'someDate',
      type: 'tweet',
      reference: null,
      userId: 'revathi'
    };
    request(app)
      .post('/user/postResponse')
      .set('Content-Type', 'application/json')
      .send(details)
      .expect({status: true})
      .expect(200, done);
  });
  it('should serve the tweets of the given hashtag', function(done) {
    request(app)
      .get('/user/searchHashtag/goodTweet')
      .set('Content-Type', 'application/json')
      .expect(200, done);
  });
  it('should be able to post a retweet', done => {
    app.locals.dataStore = new DataStore(db);
    const body = {
      content: 'a new #retweet',
      timeStamp: 'fake time',
      type: 'retweet',
      reference: 13
    };
    request(app)
      .post('/user/postResponse')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect({status: true})
      .expect(200, done);
  });
  it('should serve the retweets also of the given hashtag', function(done) {
    request(app)
      .get('/user/searchHashtag/retweet')
      .set('Content-Type', 'application/json')
      .expect(200, done);
  });
});

describe('/user/tweet/:id', () => {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should provide tweet page', done => {
    request(app)
      .get('/user/tweet/14')
      .expect(200, done);
  });
  it('should provide tweet page', done => {
    request(app)
      .get('/user/tweet/7')
      .expect(200, done);
  });
});

describe('get matching tags', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should fetch the tags contenting g', function(done) {
    request(app)
      .get('/user/serveHashtag/g')
      .set('Content-Type', 'application/json')
      .expect([{tag: 'goodTweet'}])
      .expect(200, done);
  });

  it('should not fetch any tag', function(done) {
    request(app)
      .get('/user/serveHashtag/notInTheDataBase')
      .set('Content-Type', 'application/json')
      .expect([])
      .expect(200, done);
  });

  it('should fetch the all tags', function(done) {
    request(app)
      .get('/user/serveHashtag/*')
      .set('Content-Type', 'application/json')
      .expect([{tag: 'goodTweet'}, {tag: 'retweet'}])
      .expect(200, done);
  });
  after(async () => {
    db.destroy();
  });
});
