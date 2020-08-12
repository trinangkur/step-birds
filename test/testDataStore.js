const {assert} = require('chai');
const {stub, mock} = require('sinon');
const {DataStore} = require('../src/models/datastore');

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
    const dataStore = new DataStore(newDb);
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
    const dataStore = new DataStore(newDb);
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
    const dataStore = new DataStore(newDb);
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
