const fillResponsePopup = function(tweetId, content, image_url, name) {
  return `
  <div class="response-top-bar">
    <div class="profile"><img src="${image_url}" alt="N/A"/><span class="user-name">${name}</span></div>
    <p onclick="closeResponsePopup()">X</p>
  </div>
  <div id="tweet-content">
    <p>${content}</p>
  </div>
  <div id="response-text-area">
    <textarea id="response-content" name="name" cols="120" rows="3" placeholder="write your comment..."></textarea>
  </div>
  `;
};

const addResponseButton = function(tweetId, type) {
  return `<div id="response-button" onclick="sendResponse('${tweetId}','${type.toLowerCase()}')">
    <button class="primary-btn add-access">${type}</button>
  </div>`;
};

const showReplyPopup = function(tweetId, content, image_url, name) {
  const popup = document.querySelector('#responsePopup');
  popup.style.display = 'block';
  popup.innerHTML =
    fillResponsePopup(tweetId, content, image_url, name) +
    addResponseButton(tweetId, 'Reply');
};

const showRetweetPopup = function(tweetId, content, image_url, name) {
  const popup = document.querySelector('#responsePopup');
  popup.style.display = 'block';
  popup.innerHTML =
    fillResponsePopup(tweetId, content, image_url, name) +
    addResponseButton(tweetId, 'Retweet');
};

const getSvgHandlers = function(id, content, image_url, name) {
  return {
    retweet: `show('retweet-${id}')`,
    like: `updateLikes(${id})`,
    reply: `showReplyPopup('${id}',\`${content}\`,'${image_url}','${name}')`,
    bookmark: '',
  };
};

const getCountHandlers = function(id) {
  return {
    retweet: `showRetweetedBy(${id})`,
    like: `showLikedBy(${id})`,
    reply: '',
    bookmark: '',
  };
};

const getTweetReactionHtml = function(tweet, type, colour, count) {
  const { id, content, image_url, name } = tweet;
  const countHandlers = getCountHandlers(id);
  const svgHandlers = getSvgHandlers(id, content, image_url, name);
  return `
  <div class="option">
  <div class="${type}-icon" onclick="${svgHandlers[type]}">
    <svg viewBox="0 0 24 24" class="${type}-svg ${colour}" id="${type}-svg-${id}">
      ${getSvg(type)}
    </svg>
  </div>
  <div id="${type}-count-${id}" class="${type}-count" 
  onclick="${countHandlers[type]}">${count}</div>
</div>
  `;
};

const getTweetOptions = function(tweet) {
  const { replyCount, retweetCount, likeCount } = tweet;
  const likeColour = tweet.isLiked === 'true' ? 'red' : 'black';
  const retweetColour = tweet.isRetweeted === 'true' ? 'green' : 'black';
  return `
  <div class="tweet-options">
    ${getTweetReactionHtml(tweet, 'reply', 'black', replyCount)}
    ${getTweetReactionHtml(tweet, 'retweet', retweetColour, retweetCount)}
    ${getTweetReactionHtml(tweet, 'like', likeColour, likeCount)}
    ${getTweetReactionHtml(tweet, 'bookmark', 'black', '')}
  </div>
  `;
};

const getRightSideOptions = function({ isUsersTweet, id, reference, _type }) {
  return isUsersTweet
    ? `
    <div class="options" id="tweetId-${id}" onmouseleave="hideOptions(${id})">
          <div class="delete-tweet" onclick="deleteTweet(${id}, ${reference}, '${_type}')">
              <span>Delete</span>
              <img src="/assets/delete.png" alt="N/A"> 
           </div>
    </div>
  `
    : '';
};

const getRetweetOptionHtml = function(tweet) {
  const { id, content, image_url, name, isRetweeted } = tweet;
  const color = isRetweeted === 'true' ? 'Undo Retweet' : 'Retweet';
  return `<div class="retweet-options hide" id="retweet-${id}" onmouseleave=hide('retweet-${id}')>
    <div id="retweet-without-comment-${id}" onclick="updateRetweet('${id}')"> ${color} </div>
    <div id="retweet-comment-${id}" onclick="showRetweetPopup('${id}',\`${content}\`,'${image_url}','${name}')"> Retweet with Comment </div>
  </div>`;
};

const createContent = function(content) {
  const words = content.split(' ');
  return words.reduce((contentHtml, word) => {
    const wordHtml =
      word[0] === '#'
        ? `<span class="tag" onclick="serveHashtag('${word}')">
        ${word}</span>`
        : word;
    return contentHtml + ' ' + wordHtml;
  }, '');
};

const createParentTweetHtml = function(tweet) {
  const { id, name, content, userId, timeStamp, image_url } = tweet;
  return `<div class="parent-element" id="content-${id}" onClick="openTweet(${id})">
            <div class="dp" onclick="getUserProfile('${userId}')">
              <img
                id="dp-${userId}"
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
              <div class="content" id="content-${id}" 
              onClick="openTweet(${id})">${createContent(content)}
              </div>
            </div>
          </div>`;
};

const createContentHtml = function(tweet, reference) {
  const parentTweetHtml = reference ? createParentTweetHtml(reference) : '';
  const { id, content } = tweet;
  return `<div class="content">
            <div id="content-${id}" 
            onClick="openTweet(${id})">${createContent(content)}</div>
    ${parentTweetHtml}
  </div>`;
};

const createTweetHtml = function(tweet, reference) {
  const { id } = tweet;
  const { userId, image_url, name, timeStamp } = tweet;
  return `
  <div class="content-section">
    <div class="dp" onclick="getUserProfile('${userId}')">
      <img
        id="dp-${userId}"
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
      ${createContentHtml(tweet, reference)}
    </div>
    <div class="right-side-options" onclick="showTweetOptions(${id})">v</div>
  </div>
  ${getTweetOptions(tweet)}
  ${getRightSideOptions(tweet)}
  ${getRetweetOptionHtml(tweet)}
  `;
};

const createReplyHtml = function(tweet) {
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

const replyOptions = function(id, isUsersTweet, reference, type) {
  const deleteOptions = `<div class="reply-options" id="tweetId-${id}" onmouseleave="hideOptions(${id})">
  <div class="delete-tweet" onclick="deleteTweet(${id}, ${reference}, '${type}')">
      <span>Delete</span>
      <img src="/assets/delete.png" alt="N/A"> 
   </div>
</div>`;
  return isUsersTweet ? deleteOptions : '';
};
