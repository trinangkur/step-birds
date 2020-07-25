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
          <div class="options" id="tweetId-${id}" 
          onmouseleave="hideOptions(${id})" >
            <span  onclick="deleteTweet(${id})">Delete</span>
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

const postTweet = function (boxId) {
  const tweetText = document.getElementById(`tweetText${boxId}`);
  const url = '/user/postTweet';
  if (tweetText.value) {
    const body = { content: tweetText.value };
    sendPOSTRequest(url, body, getLatestTweet);
    tweetText.value = '';
    closeTweetPopUp();
  }
};

const getAllTweets = function () {
  const url = '/user/getTweets';
  sendGETRequest(url, ({ message, tweets }) => {
    if (message === 'successful') {
      tweets.forEach(showTweet);
    }
  });
  sendGETRequest('/user/getUserInfo', ({ message, userInfo }) => {
    if (message === 'successful') {
      const profiles = document.getElementsByClassName('profileIcon');
      Array.from(profiles).forEach((profile) => {
        profile.src = userInfo[0].image_url;
      });
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

const getUserProfile = function (id) {
  location.assign(`/user/profile/${id}`);
};

const searchOnEnter = function (name) {
  if (event.keyCode === 13) {
    sendPOSTRequest('/user/searchProfile', { name }, (profiles) => {
      const contentBox = document.getElementById('contentBox');
      contentBox.innerHTML = profiles.reduce(
        (html, { id, name, image_url }) => {
          return (
            html +
            `<h1 onclick="getUserProfile('${id}')">${id}, ${name}</h1>
        <img src="${image_url}"/>`
          );
        },
        ''
      );
    });
  }
};

const hideOptions = function (id) {
  document.getElementById(`tweetId-${id}`).style.display = 'none';
};

const showTweetPopUp = function () {
  document.getElementById('tweetPopUp').style.display = 'block';
};

const closeTweetPopUp = function () {
  document.getElementById('tweetPopUp').style.display = 'none';
};
