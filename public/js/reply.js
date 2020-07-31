const sendReplyFromTweet = function(tweetId) {
  const textArea = document.querySelector('#reply-content');
  const content = textArea.value;
  if (content) {
    const timeStamp = new Date();
    const url = '/user/postReply';
    sendPOSTRequest(url, {tweetId, content, timeStamp}, res => {
      getAllReplies(res.status, tweetId, textArea);
    });
  }
};

const createReplyHtml = function(tweet) {
  const {userId, image_url, name, id, timeStamp, content, isUsersTweet} = tweet;
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
  <div class="right-side-options" >v</div>
</div>`;
};

const showReply = function(reply, parentElement) {
  const element = document.createElement('div');
  element.id = reply.id;
  element.className = 'reply';
  element.innerHTML = createReplyHtml(reply);
  const allTweets = document.getElementById(parentElement);
  allTweets.appendChild(element);
};

const getAllReplies = function(tweetId) {
  const url = '/user/getReplies';
  sendPOSTRequest(url, {tweetId}, replies => {
    document.querySelector('#replies').innerHTML = '';
    replies.forEach(reply => {
      showReply(reply, 'replies');
    });
  });
};

const main = function(tweetId) {
  getAllReplies(tweetId);
};
