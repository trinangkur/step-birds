const getUniqueCookie = function() {
  return new Date().getTime().toString() + Math.random();
};

class Sessions {
  constructor() {
    this.sessions = {};
  }
  createSession(userId) {
    const cookie = getUniqueCookie();
    this.sessions[cookie] = userId;
    return cookie;
  }
  getUserId(cookie) {
    return this.sessions[cookie];
  }
  clearSession(cookie) {
    delete this.sessions[cookie];
  }
}

module.exports = { Sessions };
