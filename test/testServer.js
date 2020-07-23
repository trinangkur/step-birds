const request = require('supertest');

const {app} = require('../src/js/app');

describe('server', () => {
  it('should give a 200 OK response back for request of /', done => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
