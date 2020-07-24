class LoginInteractor {
  constructor(clientId, clientSecret, fetcher) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.fetcher = fetcher;
  }

  getAccessToken(code) {
    return new Promise((resolve) => {
      this.fetcher('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
        }),
      })
        .then((res) => res.text())
        .then((text) => new URLSearchParams(text).get('access_token'))
        .then(resolve);
    });
  }

  fetchGitHubUser(token) {
    return new Promise((resolve) => {
      this.fetcher('https://api.github.com/user', {
        headers: {
          Authorization: 'token ' + token,
        },
      })
        .then((res) => res.json())
        .then(resolve);
    });
  }
}

module.exports = { LoginInteractor };
