const getUserTweets = function () {
  const url = '/user/getUserTweets';
  const id = document.querySelector('#profile-id').innerText.slice(1);
  sendPOSTRequest(url, { id }, ({ tweets }) => {
    tweets.forEach(showTweet);
  });
};

const profileMain = function () {
  getUserTweets();
};
