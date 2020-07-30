const { assert } = require('chai');
const sinon = require('sinon');
const { DataStore } = require('../src/models/datastore');

describe('postTweet', () => {
  it('should add tweet in database', (done) => {
    const run = sinon.stub().yields(null);
    const dataStore = new DataStore({ run });
    const details = {
      userId: 'vikram',
      content: 'Testing tweet',
      type: 'tweet',
    };
    dataStore.postTweet(details).then((message) => {
      assert.strictEqual(message, 'OK');
      done();
    });
  });
});

// describe('deleteTweet', function () {
//   it('should delete the tweet', (done) => {
//     const run = sinon.stub().yields(null);
//     const dataStore = new DataStore({ run });
//     const details = {
//       tweetId: 1,
//       userId: 'revathi',
//     };
//     dataStore.deleteTweet(details).then((message) => {
//       assert.strictEqual(message, 'OK');
//       done();
//     });
//   });
// });

describe('addTweeter', () => {
  it('should add a new tweeter in database', (done) => {
    const run = sinon.stub().yields(null);
    const dataStore = new DataStore({ run });
    dataStore
      .addTweeter({
        login: 'abc',
        avatar_url: 'https://url',
        name: 'abc',
      })
      .then((message) => {
        assert.strictEqual(message, 'OK');
        done();
      });
  });

  it('should should handle err of sql constrain', (done) => {
    const err = new Error();
    err.code = 'SQLITE_CONSTRAINT';
    const run = sinon.stub().yields(err);
    const dataStore = new DataStore({ run });
    dataStore
      .addTweeter({
        login: 'abc',
        avatar_url: 'https://url',
        name: 'abc',
      })
      .then((message) => {
        assert.strictEqual(message, 'already have an account');
        done();
      });
  });

  it('should should throw err other than sql constrain', (done) => {
    const run = sinon.stub().yields(new Error());
    const dataStore = new DataStore({ run });
    dataStore
      .addTweeter({
        login: 'abc',
        avatar_url: 'https://url',
        name: 'abc',
      })
      .catch((err) => {
        assert.isNotNull(err);
        done();
      });
  });
});

describe('getUserTweet', () => {
  it('should throw error when userId is not defined', (done) => {
    const err = new Error();
    err.code = 'user is undefined';
    const all = sinon.stub().yields(err);
    const dataStore = new DataStore({ all });
    dataStore.getUserTweets('trinangkur').catch((err) => {
      assert.strictEqual(err.code, 'user is undefined');
      done();
    });
  });
});

describe('toggleFollow', () => {
  it('should throw if transaction is not propitiate', (done) => {
    const err = new Error();
    err.code = 'no transaction active';
    const exec = (sql, cb) => {
      if (cb) {
        throw err;
      }
    };
    const dataStore = new DataStore({ exec });
    dataStore.toggleFollow('vikram', 'trinangkur').catch((err) => {
      assert.strictEqual(err.code, 'no transaction active');
      done();
    });
  });
});
