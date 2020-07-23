const assert = require('assert');
const sqlite3 = require('sqlite3').verbose();
const {getDB} = require('../config');
const {DataStore} = require('../src/models/datastore');
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
      type: 'tweet'
    };
    const status = await dataStore.postTweet(details);
    const tweetDetails = {
      columns: ['content'],
      where: 'userId="vikram" and content="Testing tweet"'
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
      tweetId: 1
    };
    const status = await dataStore.deleteTweet(details);
    const tweetDetails = {
      columns: ['*'],
      where: 'id=1'
    };
    const tweet = await dataStore.getTweet(tweetDetails);
    assert.deepStrictEqual(tweet, []);
    assert.deepStrictEqual(status, []);
  });
});
