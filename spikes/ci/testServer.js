const request = require('supertest');
const assert = require('assert');
const sqlite3 = require('sqlite3').verbose();

const { app } = require('./app');

describe('home page', () => {
  it("should give back 'welcome to our home page'", (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('content-type', /text\/html/)
      .expect(/Welcome to our page/, done);
  });
});

describe('db', () => {
  it('testing query for sqlite with travis', (done) => {
    const db = new sqlite3.Database('./spikes/db/spike.db');
    db.get('SELECT * FROM Tweeter WHERE id = "rahit"', (err, row) => {
      assert.strictEqual(row.id, 'rahit');
      done();
    });
  });
});
