const getUserTweets = function () {
  const url = '/user/getUserTweets';
  const id = document.querySelector('#profile-id').innerText.slice(1);
  sendPOSTRequest(url, { id }, ({ tweets }) => {
    tweets.forEach((tweet) => {
      showTweet(tweet);
    });
  });
};

const getDp = function () {
  const url = '/user/getUserInfo';
  sendGETRequest(url, ({ message, userInfo }) => {
    if (message === 'successful') {
      document.querySelector('#user-id').innerText = `@${userInfo[0].id}`;
      const profiles = document.getElementsByClassName('profileIcon');
      Array.from(profiles).forEach((profile) => {
        profile.src = userInfo[0].image_url;
      });
      const profileIcon = document.querySelector('#profile-icon');
      profileIcon.innerHTML = `
      <img class="profile-pic" src="${userInfo[0].image_url}"/>`;
    }
  });
};

const profileMain = function () {
  getDp();
  getUserTweets();
};
