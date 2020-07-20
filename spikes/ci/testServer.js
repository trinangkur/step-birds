const request = require('supertest');
const assert = require('assert');

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
