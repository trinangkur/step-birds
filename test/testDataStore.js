const { assert } = require('chai');
const sinon = require('sinon');
const sqlite3 = require('sqlite3').verbose();
const { getDB } = require('../config');
const { DataStore } = require('../src/models/datastore');
const dbFilePath = getDB();

const db = new sqlite3.Database(dbFilePath);
db.run('SAVEPOINT initialDB');

describe('postTweet', function() {
  it('should post the tweet', async function() {
    db.run('ROLLBACK TO initialDB');

    const dataStore = new DataStore(db);
    const details = {
      userId: 'vikram',
      content: 'Testing tweet',
      type: 'tweet',
    };
    const status = await dataStore.postTweet(details);
    const tweetDetails = {
      columns: ['content'],
      where: 'userId="vikram" and content="Testing tweet"',
    };
    const [tweet] = await dataStore.getTweet(tweetDetails);
    assert.deepStrictEqual(tweet.content, details.content);
    assert.deepStrictEqual(status, []);
  });
});

describe('deleteTweet', function() {
  it('should delete the tweet', async function() {
    db.run('ROLLBACK TO initialDB');

    const dataStore = new DataStore(db);
    const details = {
      tweetId: 1,
    };
    const status = await dataStore.deleteTweet(details);
    const tweetDetails = {
      columns: ['*'],
      where: 'id=1',
    };
    const tweet = await dataStore.getTweet(tweetDetails);
    assert.deepStrictEqual(tweet, []);
    assert.deepStrictEqual(status, []);
  });
});

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
