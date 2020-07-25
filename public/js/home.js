const createTweetHtml = function (tweet, userInfo) {
  const { content, id } = tweet;
  const { image_url, name } = userInfo;
  return `<div class="userId">
            <div class="profilePart">
                <div>
                  <img src="${image_url}" alt="not found"/>
                </div>
                <div class="userName">
                  <span> ${name} </span>
                </div>
            </div>
            <div class="optionsButton">
             <img src="/assets/options.jpeg" onclick="showTweetOptions(${id})"/>
            </div>
          </div>
          <div class="content">
            <p>${content}</p>
          </div>
          <div class="options" id="tweetId-${id}">
            <span onclick="deleteTweet(${id})">Delete</span>
          </div>`;
};

const showTweet = function (tweet) {
  const url = '/user/getUserInfo';
  sendGETRequest(url, ({ message, userInfo }) => {
    if (message === 'successful') {
      const element = document.createElement('div');
      element.id = tweet.id;
      element.className = 'tweet';
      element.innerHTML = createTweetHtml(tweet, userInfo[0]);
      const allTweets = document.getElementById('tweets');
      allTweets.prepend(element);
    }
  });
};

const getLatestTweet = function (res) {
  if (res.message === 'successful') {
    const url = '/user/getLatestTweet';
    sendGETRequest(url, ({ message, tweet }) => {
      if (message === 'successful') {
        showTweet(tweet);
      }
    });
  }
};

const postTweet = function () {
  const tweetText = document.getElementById('tweetText');
  const url = '/user/postTweet';
  const body = { content: tweetText.value };
  sendPOSTRequest(url, body, getLatestTweet);
  tweetText.value = '';
};

const getAllTweets = function () {
  const url = '/user/getTweets';
  sendGETRequest(url, ({ message, tweets }) => {
    if (message === 'successful') {
      tweets.forEach(showTweet);
    }
  });
};

const showTweetOptions = function (id) {
  document.getElementById(`tweetId-${id}`).style.display = 'block';
};

const updateTweets = function (id, { message }) {
  if (message === 'successful') {
    const element = document.getElementById(id);
    element.parentNode.removeChild(element);
  }
};

const deleteTweet = function (tweetId) {
  const url = '/user/deleteTweet';
  const body = { tweetId };
  sendPOSTRequest(url, body, (res) => updateTweets(tweetId, res));
};
