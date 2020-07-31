const sendReply = function(tweetId) {
  const textArea = document.querySelector('#reply-content');
  const content = textArea.value;
  if (content) {
    const timeStamp = new Date();
    const url = '/user/postReply';
    sendPOSTRequest(url, {tweetId, content, timeStamp}, res => {
      if (res.status) {
        location.reload();
      }
    });
  }
};

const closeReplyPopup = function() {
  document.querySelector('#replyPopup').style.display = 'none';
};

const fillReplyPopup = function(tweetId, content, image_url, name) {
  return `
  <div class="reply-top-bar">
    <div class="profile"><img src="${image_url}" alt="N/A"/><span class="user-name">${name}</span></div>
    <p onclick="closeReplyPopup()">X</p>
  </div>
  <div id="tweet-content">
    <p>${content}</p>
  </div>
  <div id="reply-text-area">
    <textarea id="reply-content" name="name" cols="120" rows="3" placeholder="give your reply"></textarea>
  </div>
  <div id="reply-button" onclick="sendReply(${tweetId})">
    <button class="primary-btn add-access">Reply</button>
</div>`;
};

const showReplyPopup = function(tweetId, content, image_url, name) {
  const popup = document.querySelector('#replyPopup');
  popup.style.display = 'block';
  popup.innerHTML = fillReplyPopup(tweetId, content, image_url, name);
};

const getReplay = function(tweet) {
  const {id, content, image_url, name, replyCount} = tweet;
  return `
  <div class="option">
                <div class="replay-icon" onclick="showReplyPopup('${id}','${content}','${image_url}','${name}')">
                  <svg class="replay-svg" viewBox="0 0 24 24">
                    ${getReplySvgPath()}
                  </svg>
                </div>
                <div class="replay-count" id="reply-count-${id}">${replyCount}</div>
              </div>
  `;
};

const getRetweet = function({id, retweetCount, isRetweeted}) {
  const colour = isRetweeted === 'true' ? 'green' : 'black';
  return `
  <div class="option">
  <div class="retweet-icon" onclick="show('retweet-${id}')">
    <svg class="retweet-svg" viewBox="0 0 24 24" class="retweet-svg ${colour}" id="retweet-svg-${id}">
      ${getRetweetSvgPath()}
    </svg>
  </div>
  <div id="retweet-count-${id}" class="retweet-count">${retweetCount}</div>
</div>
  `;
};

const getLike = function({id, likeCount, isLiked}) {
  const colour = isLiked === 'true' ? 'red' : 'black';
  return `
  <div class="option">
  <div class="like-icon" onclick="updateLikes('${id}')">
    <svg viewBox="0 0 24 24" class="like-svg ${colour}" id="like-svg-${id}">
      ${getLikeSvgPath()}
    </svg>
  </div>
  <div id="like-count-${id}" class="like-count" onclick="showLikedBy('${id}')">${likeCount}</div>
</div>
  `;
};

const getBookmark = function() {
  return `
  <div class="option">
  <div class="bookmark-icon">
    <svg class="bookmark-svg">
      ${getBookmarkSvgPath()}
    </svg>
  </div>
</div>
  `;
};

const getTweetOptions = function(tweet) {
  return `
  <div class="tweet-options">
    ${getReplay(tweet)}
    ${getRetweet(tweet)}
    ${getLike(tweet)}
    ${getBookmark()}
  </div>
  `;
};

const getRightSideOptions = function (isUsersTweet, id, reference, type) {
  return isUsersTweet
    ? `
    <div class="options" id="tweetId-${id}" onmouseleave="hideOptions(${id})">
          <div class="delete-tweet" onclick="deleteTweet(${id}, ${reference}, '${type}')">
              <span>Delete</span>
              <img src="/assets/delete.png" alt="N/A"> 
           </div>
    </div>
  `
    : '';
};

const createTweetHtml = function (tweet) {
  const { content, id, isUsersTweet, reference } = tweet;
  const { userId, image_url, name, timeStamp, type } = tweet;
  if (type === 'retweet') {
    let tweet = `<div class="retweet-by">@${userId} retweeted</div>`;
    tweet += document.querySelector(`#_${reference}`).innerHTML;
    return tweet;
  }
  return `
  <div class="content-section">
  <div class="dp" onclick="getUserProfile('${userId}')">
    <img
      src="${image_url}"
      alt="not found"
    />
  </div>
  <div class="info">
    <div class="user-info">
      <span class="user-name" onclick="getUserProfile('${userId}')">${name}</span>
      <span class="user-id">@${userId}</span>
      <span></span>
      <span class="time-stamp"> &nbsp; ${moment(timeStamp).fromNow()}</span>
    </div>
    <div class="content" id="content-${id}" onClick="openTweet(${id})">${content}</div>
  </div>
  <div class="right-side-options" onclick="showTweetOptions(${id})">v</div>
</div>
  ${getTweetOptions(tweet)}
  ${getRightSideOptions(isUsersTweet, id, reference, type)}
  <div class="retweet-options hide" id="retweet-${id}" onmouseleave=hide('retweet-${id}')>
    <div id="retweet-${id}" onclick="updateRetweet('${id}')"> Retweet </div>
    <div id="retweet-comment-${id}" onclick="updateRetweetWithComment(${id})"> Retweet with Comment </div>
  </div>
  `;
};

const updateLikes = function(tweetId) {
  const url = '/user/updateLikes';
  sendPOSTRequest(url, {tweetId}, ({message}) => {
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
    const element = document.getElementById(id);
    element.parentNode.removeChild(element);
  }
};

const deleteTweet = function (tweetId, reference, type) {
  const url = '/user/deleteTweet';
  const body = { tweetId, reference, type };
  sendPOSTRequest(url, body, (res) => updateTweets(tweetId, res));
};

const deleteTweetPage = function(tweetId) {
  const url = '/user/deleteTweet';
  const body = {tweetId};
  sendPOSTRequest(url, body, res => {
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
    sendGETRequest(url, tweet => {
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
  sendPOSTRequest(url, {tweetId}, tweeters => {
    element.innerHTML = '';
    tweeters.forEach(tweet => {
      element.innerHTML += createProfileTemplate(tweet);
    });
  });
  show('editor');
};

const updateCount = function (tweetId, isIncrease) {
  const counterElement = document.querySelector(`#retweet-count-${tweetId}`);
  const count = +counterElement.innerText;
  counterElement.innerText = isIncrease ? count + 1 : count - 1;
};

const updateRetweet = function (tweetId) {
  const url = '/user/postRetweet';
  const content = document.querySelector(`#content-${tweetId}`).innerText;
  const body = {
    content,
    timeStamp: new Date(),
    type: 'retweet',
    reference: tweetId
  };
  sendPOSTRequest(url, body, (status) => {
    if (status) {
      updateCount(tweetId, true);
      const retweet = document.querySelector(`#retweet-${tweetId}`);
      retweet.innerText = 'Undo Retweet';
      retweet.onclick = `undoRetweet(${tweetId}t)`;
    }
  });
};

const undoRetweet = function (tweetId) {
  updateCount(tweetId, false);
  const retweet = document.querySelector(`#retweet-${tweetId}`);
  retweet.innerText = 'Retweet';
  retweet.onclick = `updateRetweet(${tweetId})`;
};
