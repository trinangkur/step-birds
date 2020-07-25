const createTweetHtml = function(content, userId) {
  return `<div class="userId">
  <div><img src="/assets/profile.png" alt="not found"/></div>
  <div class="userName"><span> ${userId}</span></div>
  </div>
   <div class="content"><p>${content}</p></div>`;
};

const showTweet = function({message, tweets}) {
  if (message === 'successful') {
    const [tweet] = tweets;
    const element = document.createElement('div');
    element.id = tweet.id;
    element.className = 'tweet';
    element.innerHTML = createTweetHtml(tweet.content, tweet.userId);
    const allTweets = document.getElementById('tweets');
    allTweets.appendChild(element);
  }
};

const getLatestTweet = function(res) {
  if (res.message === 'successful') {
    const url = '/user/getLatestTweet';
    sendGETRequest(url, showTweet);
  }
};

const postTweet = function() {
  const tweetText = document.getElementById('tweetText');
  const url = '/user/postTweet';
  const body = {content: tweetText.value};
  sendPOSTRequest(url, body, getLatestTweet);
  tweetText.value = '';
};

const showTweets = function() {
  getLatestTweet({message: 'successful'});
};
