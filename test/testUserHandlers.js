const request = require('supertest');
const {getDB} = require('../config');
const {DataStore} = require('../src/models/datastore');
const {app} = require('../src/app');
const Sqlite3 = require('sqlite3').verbose();
const db = new Sqlite3.Database(getDB());

describe('/postTweet', () => {
  before(() => {
    const sessions = {getUserId: () => 'revathi'};
    app.locals.sessions = sessions;
  });
  it('should be able to post a new tweet', done => {
    app.locals.dataStore = new DataStore(db);
    const body = JSON.stringify({content: 'new tweet'});
    request(app)
      .post('/user/postTweet')
      .set('Content-Type', 'application/json')
      .send({body, userId: 'revathi'})
      .expect({status: true})
      .expect(200, done);
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
      .send({tweetId: 1, type: 'tweet'})
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
    const expected = {
      userId: 'vikram',
      name: 'Vikram Singh',
      id: 7,
      content: 'My laptop is broken :(',
      timeStamp: 'someDate',
      likeCount: 1,
      replyCount: 0,
      retweetCount: 0,
      image_url: 'fakeUrl',
      type: 'tweet',
      tweetId: null,
      isLiked: 'true',
      isRetweeted: 'false',
      isUsersTweet: true
    };
    const expectedJson = JSON.stringify(expected);
    request(app)
      .get('/user/getLatestTweet')
      .send({
        userId: 'vikram'
      })
      .expect(200)
      .expect(expectedJson, done);
  });
});

describe('searchProfile', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should serve searchProfile', function(done) {
    request(app)
      .post('/user/searchProfile')
      .set('Content-Type', 'application/json')
      .send({name: 'rahit'})
      .expect([
        {id: 'rahit', name: 'Rahit Kar', image_url: 'fakeUrl'},
        {id: 'rahitkar', name: 'Rahit Kar', image_url: 'fakeUrl'}
      ])
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
    const expected = {status: true};
    request(app)
      .post('/user/toggleFollowRequest')
      .set('Content-Type', 'application/json')
      .send({tweeter: 'vikram'})
      .expect(200)
      .expect(expected, done);
  });

  it('should unfollow a particular tweeter', done => {
    app.locals.dataStore = new DataStore(db);
    const expected = {status: false};
    request(app)
      .post('/user/toggleFollowRequest')
      .set('Content-Type', 'application/json')
      .send({tweeter: 'vikram'})
      .expect(200)
      .expect(expected, done);
  });
});

describe('getAllTweets', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  const expected = [
    {
      id: 7,
      replyCount: 0,
      likeCount: 1,
      retweetCount: 0,
      userId: 'vikram',
      type: 'tweet',
      content: 'My laptop is broken :(',
      reference: null,
      timeStamp: 'someDate',
      'id:1': 'vikram',
      name: 'Vikram Singh',
      joiningDate: '11/06/2018',
      image_url: 'fakeUrl',
      dob: '09/09/2000',
      bio: 'My feets are not on ground',
      followersCount: 0,
      followingCount: 1,
      'id:2': 7,
      tweetId: null,
      isLiked: 'true',
      isRetweeted: 'false',
      isUsersTweet: true
    },
    {
      id: 9,
      replyCount: 0,
      likeCount: 0,
      retweetCount: 0,
      userId: 'ramu',
      type: 'tweet',
      content: 'I am amazed by the performance',
      reference: 3,
      timeStamp: 'someDate',
      'id:1': 'ramu',
      name: 'Ramu kaka',
      joiningDate: '11/06/2018',
      image_url: 'fakeUrl',
      dob: '09/09/2000',
      bio: 'Work is Worship',
      followersCount: 1,
      followingCount: 0,
      'id:2': 9,
      tweetId: null,
      isLiked: 'false',
      isRetweeted: 'false',
      isUsersTweet: false
    }
  ];
  it('should get tweets for given user', function(done) {
    request(app)
      .get('/user/getAllTweets')
      .expect(expected)
      .expect(200, done);
  });
});

describe('/user/tweet/:id', () => {
  it('should provide tweet page', done => {
    request(app)
      .get('/user/tweet/4')
      .expect(200, done);
  });
});

describe('/user/postReply', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should post a reply', function(done) {
    const body = {
      content: 'nice reply',
      timeStamp: 'oneTimeStamp',
      tweetId: 7
    };
    request(app)
      .post('/user/postReply')
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
      .send({tweetId: 13, type: 'reply'})
      .expect({status: true})
      .expect(200, done);
  });
});

describe('/user/getReplies', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'revathi'};
  });
  it('should get reply of a given tweet id', function(done) {
    const body = {
      tweetId: 7
    };
    request(app)
      .post('/user/getReplies')
      .send(body)
      .expect([
        {
          id: 12,
          _type: 'reply',
          userId: 'vikram',
          content: 'nice reply',
          timeStamp: 'oneTimeStamp',
          likeCount: 0,
          replyCount: 0,
          retweetCount: 0,
          reference: 7,
          name: 'Vikram Singh',
          joiningDate: '11/06/2018',
          image_url: 'fakeUrl',
          dob: '09/09/2000',
          bio: 'My feets are not on ground',
          followersCount: 0,
          followingCount: 1,
          isUsersTweet: false
        }
      ])
      .expect(200, done);
  });
});

describe('/user/getRepliedTweets', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should get all tweets where user have replied', function(done) {
    const body = {
      userId: 'vikram'
    };
    request(app)
      .post('/user/getRepliedTweets')
      .send(body)
      .expect([
        {
          id: 7,
          userId: 'vikram',
          content: 'My laptop is broken :(',
          _type: 'tweet',
          replyCount: 1,
          likeCount: 1,
          retweetCount: 0,
          'id:1': 'vikram',
          name: 'Vikram Singh',
          joiningDate: '11/06/2018',
          image_url: 'fakeUrl',
          dob: '09/09/2000',
          bio: 'My feets are not on ground',
          followersCount: 0,
          followingCount: 1,
          'id:2': 7,
          tweetId: null,
          isLiked: 'true',
          isRetweeted: 'false',
          isUsersTweet: true
        }
      ])
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
    const body = {tweetId: 7};
    const expected = [
      {
        tweetId: 7,
        userId: 'vikram',
        id: 'vikram',
        name: 'viky',
        joiningDate: '11/06/2018',
        image_url: 'fakeUrl',
        dob: '09/09/2000',
        bio: 'it is your life make it large',
        followersCount: 0,
        followingCount: 1
      }
    ];
    request(app)
      .post('/user/getLikedBy')
      .send(body)
      .expect(expected)
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
    const body = {id: 'vikram', activity: 'tweets'};
    const expected = [
      {
        userId: 'vikram',
        name: 'viky',
        id: 7,
        content: 'My laptop is broken :(',
        timeStamp: 'someDate',
        likeCount: 1,
        replyCount: 1,
        retweetCount: 0,
        image_url: 'fakeUrl',
        type: 'tweet',
        tweetId: null,
        isLiked: 'false',
        isRetweeted: 'false',
        isUsersTweet: false
      }
    ];
    request(app)
      .post('/user/getActivitySpecificTweets')
      .send(body)
      .expect(200)
      .expect(expected, done);
  });

  it('should give all the tweets of which user retweets', done => {
    const body = {id: 'vikram', activity: 'retweets'};
    const expected = [
      {
        userId: null,
        id: null,
        content: null,
        likeCount: null,
        _type: null,
        replyCount: null,
        reference: null,
        retweetCount: null,
        'id:1': null,
        name: null,
        joiningDate: null,
        image_url: null,
        dob: null,
        bio: null,
        followersCount: null,
        followingCount: null,
        'id:2': null,
        tweetId: null,
        isLiked: 'false',
        isRetweeted: 'false',
        isUsersTweet: false
      }
    ];
    request(app)
      .post('/user/getActivitySpecificTweets')
      .send(body)
      .expect(200)
      .expect(expected, done);
  });

  it('should give all the tweets of which user Liked', done => {
    const body = {id: 'vikram', activity: 'likes'};
    const expected = [
      {
        userId: 'vikram',
        id: 7,
        content: 'My laptop is broken :(',
        likeCount: 1,
        _type: 'tweet',
        replyCount: 1,
        reference: null,
        retweetCount: 0,
        'id:1': 'vikram',
        name: 'viky',
        joiningDate: '11/06/2018',
        image_url: 'fakeUrl',
        dob: '09/09/2000',
        bio: 'it is your life make it large',
        followersCount: 0,
        followingCount: 1,
        'id:2': 7,
        tweetId: null,
        isLiked: 'false',
        isRetweeted: 'false',
        isUsersTweet: false
      }
    ];
    request(app)
      .post('/user/getActivitySpecificTweets')
      .send(body)
      .expect(200)
      .expect(expected, done);
  });
});

describe('/user/getRetweetedBy', function() {
  before(() => {
    app.locals.sessions = {getUserId: () => 'vikram'};
  });
  it('should get the list of user who retweeted the tweet', function(done) {
    const body = {tweetId: 10};
    const expected = [
      {
        tweetId: 10,
        userId: 'vikram',
        id: 'vikram',
        name: 'viky',
        joiningDate: '11/06/2018',
        image_url: 'fakeUrl',
        dob: '09/09/2000',
        bio: 'it is your life make it large',
        followersCount: 0,
        followingCount: 1
      }
    ];
    request(app)
      .post('/user/getRetweetedBy')
      .send(body)
      .expect(expected)
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
