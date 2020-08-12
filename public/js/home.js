const getAllTweets = function () {
  const url = '/user/getAllTweets';
  sendGETRequest(url, (tweets) => {
    document.getElementById('tweets').innerHTML = '';
    tweets.forEach(({ tweet, reference }) => {
      showTweet(tweet, 'tweets', reference);
    });
  });
};

const main = function () {
  getAllTweets();
  setInterval(getAllTweets, 5000);
};
