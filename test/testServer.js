const request = require('supertest');

const { app } = require('../src/app');

describe('server', () => {
  it("should give a response of 200 OK for request of '/'", (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
