const getReplay = function() {
  return `
  <div class="option">
                <div class="replay-icon">
                  <svg class="replay-svg" viewBox="0 0 24 24">
                    <g>
                      <path
                        d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div class="replay-count">0</div>
              </div>
  `;
};

const getRetweet = function() {
  return `
  <div class="option">
  <div class="retweet-icon">
    <svg class="retweet-svg" viewBox="0 0 24 24">
      <g>
        <path
          d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
        ></path>
      </g>
    </svg>
  </div>
  <div class="retweet-count">0</div>
</div>
  `;
};

const getLike = function(id, likeCount, isLiked) {
  const colour = isLiked === 'true' ? 'red' : 'black';
  return `
  <div class="option">
  <div class="like-icon" onclick="updateLikes('${id}')">
    <svg viewBox="0 0 24 24" class="like-svg ${colour}" id="like-svg-${id}">
      <g>
        <path
          d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"
        ></path>
      </g>
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
      <g>
        <path
          d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"
        ></path>
        <path
          d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"
        ></path>
      </g>
    </svg>
  </div>
</div>
  `;
};

const getTweetOptions = function(id, likeCount, isLiked) {
  return `
  <div class="tweet-options">
    ${getReplay()}
    ${getRetweet()}
    ${getLike(id, likeCount, isLiked)}
    ${getBookmark()}
  </div>
  `;
};

const getRightSideOptions = function(isUsersTweet, id) {
  return isUsersTweet
    ? `
    <div class="options" id="tweetId-${id}" onmouseleave="hideOptions(${id})">
          <div class="delete-tweet" onclick="deleteTweet(${id})">
              <span>Delete</span>
              <img src="/assets/delete.png" alt="N/A"> 
           </div>
    </div>
  `
    : '';
};

const createTweetHtml = function(tweet) {
  const { content, id, isUsersTweet, isLiked, likeCount } = tweet;
  const { userId, image_url, name, timeStamp } = tweet;
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
    <div class="content" onClick="openTweet(${id})">${content}</div>
  </div>
  <div class="right-side-options" onclick="showTweetOptions(${id})">v</div>
</div>
  ${getTweetOptions(id, likeCount, isLiked)}
  ${getRightSideOptions(isUsersTweet, id)}
  `;
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
    const element = document.getElementById(id);
    element.parentNode.removeChild(element);
  }
};

const deleteTweet = function(tweetId) {
  const url = '/user/deleteTweet';
  const body = { tweetId };
  sendPOSTRequest(url, body, (res) => updateTweets(tweetId, res));
};

const deleteTweetPage = function(tweetId) {
  const url = '/user/deleteTweet';
  const body = { tweetId };
  sendPOSTRequest(url, body, (res) => {
    if (res.status) {
      location.assign('/user/home');
    }
  });
};

const showTweet = function(tweet, parentElement) {
  const element = document.createElement('div');
  element.id = tweet.id;
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
    const body = { content: tweetText.value, timeStamp: new Date() };
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
  show('editor');
};
