const sendResponse = function (tweetId, type) {
  closeResponsePopup();
  const textArea = 'response-content';
  const callbacks = {
    retweet: getLatestRetweet,
    reply: (res) => {
      if (res.status) {
        location.reload();
      }
    },
  };
  postResponse(textArea, tweetId, type, callbacks[type]);
};

const closeResponsePopup = function () {
  document.querySelector('#responsePopup').style.display = 'none';
};

const updateLikes = function (tweetId) {
  const url = '/user/updateLikes';
  sendPOSTRequest(url, { tweetId }, ({ isLiked }) => {
    const counterElement = document.querySelector(`#like-count-${tweetId}`);
    const count = +counterElement.innerText;
    const likeSvg = document.querySelector(`#like-svg-${tweetId}`);

    if (isLiked) {
      counterElement.innerText = count + 1;
      likeSvg.setAttribute('class', 'red');
      return;
    }
    likeSvg.removeAttribute('class', 'red');
    counterElement.innerText = count - 1;
  });
};

const showTweetOptions = function (id) {
  document.getElementById(`tweetId-${id}`).style.display = 'block';
};

const updateTweets = function (id, res) {
  if (res.status) {
    const element = document.getElementById(`_${id}`);
    element.parentNode.removeChild(element);
  }
};

const deleteTweet = function (tweetId, reference, type) {
  const url = '/user/deleteTweet';
  const body = { tweetId, reference, type };
  sendPOSTRequest(url, body, (res) => updateTweets(tweetId, res));
};

const deleteTweetPage = function (tweetId) {
  const url = '/user/deleteTweet';
  const body = { tweetId, type: 'tweet' };
  sendPOSTRequest(url, body, (res) => {
    if (res.status) {
      location.assign('/user/home');
    }
  });
};

const showTweet = function (tweet, parentElement, reference) {
  const element = document.createElement('div');
  element.id = `_${tweet.id}`;
  element.className = 'tweet';
  element.innerHTML = createTweetHtml(tweet, reference);
  const allTweets = document.getElementById(parentElement);
  allTweets.prepend(element);
};

const hideOptions = function (id) {
  document.getElementById(`tweetId-${id}`).style.display = 'none';
};

const getLatestTweet = function (res) {
  if (res.status) {
    const url = '/user/getLatestTweet';
    sendGETRequest(url, (tweet) => {
      const pageUserId = document.querySelector('#tweets').getAttribute('name');
      if (pageUserId === tweet.userId) {
        showTweet(tweet, 'tweets');
      }
    });
  }
};

const getLatestRetweet = function (res) {
  if (res.status) {
    const url = '/user/getLatestRetweet';
    sendGETRequest(url, (res) => {
      const { retweet, tweet } = res;
      showTweet(retweet, 'tweets', tweet);
    });
  }
};

const postResponse = function (textArea, reference, type, callback) {
  const tweetText = document.querySelector(`#${textArea}`);
  const url = '/user/postResponse';
  if (tweetText.value) {
    const body = {
      content: tweetText.value,
      timeStamp: new Date(),
      type,
      reference,
    };
    sendPOSTRequest(url, body, callback);
    tweetText.value = '';
    closeTweetPopUp();
  }
};

const openTweet = function (id) {
  location.assign(`/user/tweet/${id}`);
};

const show = function (elementId) {
  const element = document.querySelector(`#${elementId}`);
  element.classList.remove('hide');
  element.classList.add('show');
};

const hide = function (elementId) {
  const element = document.querySelector(`#${elementId}`);

  element.classList.add('hide');
  element.classList.remove('show');
};

const showLikedBy = function (tweetId) {
  const url = '/user/getLikedBy';
  const element = document.querySelector('#liked-user');
  sendPOSTRequest(url, { tweetId }, (tweeters) => {
    element.innerHTML = '';
    tweeters.forEach((tweet) => {
      element.innerHTML += createProfileTemplate(tweet);
    });
  });
  show('editor-liked');
};

const showRetweetedBy = function (tweetId) {
  const url = '/user/getRetweetedBy';
  const element = document.querySelector('#retweeted-user');
  sendPOSTRequest(url, { tweetId }, (tweeters) => {
    element.innerHTML = '';
    tweeters.forEach((tweet) => {
      element.innerHTML += createProfileTemplate(tweet);
    });
  });
  show('editor-retweeted');
};

const updateRetweet = function (tweetId) {
  const url = '/user/updateRetweets';
  const counterElement = document.querySelector(`#retweet-count-${tweetId}`);
  const retweetSvg = document.querySelector(`#retweet-svg-${tweetId}`);
  sendPOSTRequest(url, { tweetId }, ({ isRetweeted }) => {
    const count = +counterElement.innerText;
    const retweetContent = document.querySelector(
      `#retweet-without-comment-${tweetId}`
    );
    if (isRetweeted) {
      retweetContent.innerText = 'Undo Retweet';
      counterElement.innerText = count + 1;
      retweetSvg.setAttribute('class', 'green');
      return;
    }
    retweetSvg.removeAttribute('class', 'green');
    retweetContent.innerText = 'Retweet';
    counterElement.innerText = count - 1;
  });
};

const updateRetweetWithComments = function (tweetid) {};
