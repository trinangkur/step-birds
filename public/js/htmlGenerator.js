const fillReplyPopup = function (tweetId, content, image_url, name) {
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

const showReplyPopup = function (tweetId, content, image_url, name) {
  const popup = document.querySelector('#replyPopup');
  popup.style.display = 'block';
  popup.innerHTML = fillReplyPopup(tweetId, content, image_url, name);
};

const getReplay = function (tweet) {
  const { id, content, image_url, name, replyCount } = tweet;
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

const getRetweet = function ({ id, retweetCount, isRetweeted }) {
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

const getLike = function ({ id, likeCount, isLiked }) {
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

const getBookmark = function () {
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

const getTweetOptions = function (tweet) {
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

const createReplyHtml = function (tweet) {
  const { userId, image_url, name, reference, _type } = tweet;
  const { id, timeStamp, content, isUsersTweet } = tweet;
  return `<div class="reply-content-section">
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
      <span class="time-stamp"> &nbsp; ${moment(timeStamp).fromNow()}</span>
    </div>
    <div class="reply-content" id="content-${id}">${content}</div>
  </div>
  <div class="right-side-options" onclick="showTweetOptions(${id})">v</div>
  </div>${replyOptions(id, isUsersTweet, reference, _type)}`;
};

const replyOptions = function (id, isUsersTweet, reference, type) {
  const deleteOptions = `<div class="reply-options" id="tweetId-${id}" onmouseleave="hideOptions(${id})">
  <div class="delete-tweet" onclick="deleteTweet(${id}, ${reference}, '${type}')">
      <span>Delete</span>
      <img src="/assets/delete.png" alt="N/A"> 
   </div>
</div>`;
  return isUsersTweet ? deleteOptions : '';
};
