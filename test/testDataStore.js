const {assert} = require('chai');
const sinon = require('sinon');
const {stub, mock} = require('sinon');
const {DataStore} = require('../src/models/datastore');

describe('postResponse', () => {
  it('should add tweet in database', done => {
    const run = sinon.stub().yields(null);
    const all = sinon.stub().yields(null, [{id: 2}]);
    const exec = sinon.stub().yields(null);
    const dataStore = new DataStore({run, all, exec});
    const details = {
      userId: 'vikram',
      content: 'Testing tweet',
      type: 'tweet'
    };
    dataStore.postResponse(details).then(message => {
      assert.strictEqual(message, true);
      done();
    });
  });
  it('should add tweet with hashtag in database', done => {
    const run = sinon.stub().yields(null);
    const all = sinon.stub().yields(null, [{id: 2}]);
    const exec = sinon.stub().yields(null);
    const dataStore = new DataStore({run, all, exec});
    const details = {
      userId: 'vikram',
      content: 'Testing #hashtag',
      type: 'tweet'
    };
    dataStore.postResponse(details).then(message => {
      assert.strictEqual(message, true);
      done();
    });
  });
});

describe('addTweeter', () => {
  it('should add a new tweeter in database', async () => {
    const newDb = stub().returns({
      insert: mock()
        .withArgs({
          id: 'abc',
          image_url: 'https://url',
          name: 'abc'
        })
        .returns(Promise.resolve())
    });
    const dataStore = new DataStore({}, newDb);
    const status = await dataStore.addTweeter({
      login: 'abc',
      avatar_url: 'https://url',
      name: 'abc'
    });
    assert.ok(newDb.calledOnce);
    assert.ok(status);
  });

  it('should should handle err of sql constrain', async () => {
    const err = new Error();
    err.code = 'SQLITE_CONSTRAINT';
    const newDb = stub().returns({
      insert: mock()
        .withArgs({
          id: 'abc',
          image_url: 'https://url',
          name: 'abc'
        })
        .returns(Promise.reject(err))
    });
    const dataStore = new DataStore({}, newDb);
    const message = await dataStore.addTweeter({
      login: 'abc',
      avatar_url: 'https://url',
      name: 'abc'
    });
    assert.strictEqual(message, 'already have an account');
  });

  it('should should throw err other than sql constrain', async () => {
    const newDb = stub().returns({
      insert: mock()
        .withArgs({
          id: 'abc',
          image_url: 'https://url',
          name: 'abc'
        })
        .returns(Promise.reject(new Error()))
    });
    const dataStore = new DataStore({}, newDb);
    dataStore
      .addTweeter({
        login: 'abc',
        avatar_url: 'https://url',
        name: 'abc'
      })
      .catch(err => {
        assert.isNotNull(err);
      });
  });
});

describe('getUserTweet', () => {
  it('should throw error when userId is not defined', done => {
    const err = new Error();
    err.code = 'user is undefined';
    const all = sinon.stub().yields(err);
    const dataStore = new DataStore({all});
    dataStore.getUserTweets('trinangkur').catch(err => {
      assert.strictEqual(err.code, 'user is undefined');
      done();
    });
  });
});

describe('toggleFollow', () => {
  it('should throw if transaction is not propitiate', done => {
    const err = new Error();
    err.code = 'no transaction active';
    const exec = (sql, cb) => {
      if (cb) {
        throw err;
      }
    };
    const dataStore = new DataStore({exec});
    dataStore.toggleFollow('vikram', 'trinangkur').catch(err => {
      assert.strictEqual(err.code, 'no transaction active');
      done();
    });
  });
});
