const assert = require('assert');
const sqlite3 = require('sqlite3').verbose();
const {getDB} = require('../config.js');

const dbPath = getDB();

describe('db', () => {
  it('testing query with test data', done => {
    const db = new sqlite3.Database(dbPath);
    db.get('SELECT * FROM Tweeter WHERE id = "rahit"', (err, row) => {
      assert.strictEqual(err, null);
      assert.strictEqual(row.id, 'rahit');
      done();
    });
  });
});
