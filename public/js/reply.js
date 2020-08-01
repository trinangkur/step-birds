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

const showReply = function(reply, parentElement) {
  const element = document.createElement('div');
  element.id = `_${reply.id}`;
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
