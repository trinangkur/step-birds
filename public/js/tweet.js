const sendReply = function(tweetId) {
  const textArea = document.querySelector('#reply-content');
  const content = textArea.value;
  if (content) {
    const timeStamp = new Date();
    const url = '/user/postReply';
    sendPOSTRequest(url, { tweetId, content, timeStamp }, (res) => {
      if (res.status) {
        location.reload();
      }
    });
  }
};

const closeReplyPopup = function() {
  document.querySelector('#replyPopup').style.display = 'none';
};

const updateLikes = function(tweetId) {
  const url = '/user/updateLikes';
  sendPOSTRequest(url, { tweetId }, ({ message }) => {
    const counterElement = document.querySelector(`#like-count-${tweetId}`);
    const count = +counterElement.innerText;
    const likeSvg = document.querySelector(`#like-svg-${tweetId}`);

    if (message === 'liked') {
      counterElement.innerText = count + 1;
      likeSvg.setAttribute('class', 'red');
      return;
    }
    likeSvg.removeAttribute('class', 'red');
    counterElement.innerText = count - 1;
  });
};

const showTweetOptions = function(id) {
  document.getElementById(`tweetId-${id}`).style.display = 'block';
};

const updateTweets = function(id, res) {
  if (res.status) {
    const element = document.getElementById(`_${id}`);
    element.parentNode.removeChild(element);
  }
};

const deleteTweet = function(tweetId, reference, type) {
  const url = '/user/deleteTweet';
  const body = { tweetId, reference, type };
  sendPOSTRequest(url, body, (res) => updateTweets(tweetId, res));
};

const deleteTweetPage = function(tweetId) {
  const url = '/user/deleteTweet';
  const body = { tweetId, type: 'tweet' };
  sendPOSTRequest(url, body, (res) => {
    if (res.status) {
      location.assign('/user/home');
    }
  });
};

const showTweet = function(tweet, parentElement) {
  const element = document.createElement('div');
  element.id = `_${tweet.id}`;
  element.className = 'tweet';
  element.innerHTML = createTweetHtml(tweet);
  const allTweets = document.getElementById(parentElement);
  allTweets.prepend(element);
};

const hideOptions = function(id) {
  document.getElementById(`tweetId-${id}`).style.display = 'none';
};

const getLatestTweet = function(res) {
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

const postTweet = function(boxId) {
  const tweetText = document.getElementById(`tweetText${boxId}`);
  const url = '/user/postTweet';
  if (tweetText.value) {
    const body = {
      content: tweetText.value,
      timeStamp: new Date(),
      type: 'tweet',
    };
    sendPOSTRequest(url, body, getLatestTweet);
    tweetText.value = '';
    closeTweetPopUp();
  }
};

const openTweet = function(id) {
  location.assign(`/user/tweet/${id}`);
};

const show = function(elementId) {
  const element = document.querySelector(`#${elementId}`);
  element.classList.remove('hide');
  element.classList.add('show');
};

const hide = function(elementId) {
  const element = document.querySelector(`#${elementId}`);
  
  element.classList.add('hide');
  element.classList.remove('show');
};

const showLikedBy = function(tweetId) {
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

const showRetweetedBy = function(tweetId) {
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

const updateRetweet = function(tweetId) {
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
