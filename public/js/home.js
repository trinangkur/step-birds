const getLatestTweet = function(res) {
  if (res.status) {
    const url = '/user/getLatestTweet';
    sendGETRequest(url, tweet => {
      const pageUserId = document.querySelector('#tweets').getAttribute('name');
      if (pageUserId === tweet.userId) {
        showTweet(tweet);
      }
    });
  }
};

const postTweet = function(boxId) {
  const tweetText = document.getElementById(`tweetText${boxId}`);
  const url = '/user/postTweet';
  if (tweetText.value) {
    const body = { content: tweetText.value, timeStamp: new Date() };
    sendPOSTRequest(url, body, getLatestTweet);
    tweetText.value = '';
    closeTweetPopUp();
  }
};

const getAllTweets = function() {
  const url = '/user/getAllTweets';
  sendGETRequest(url, tweets => {
    document.getElementById('tweets').innerHTML = '';
    tweets.forEach(tweet => {
      showTweet(tweet);
    });
  });
};

const main = function() {
  getAllTweets();
  setInterval(getAllTweets, 5000);
};
