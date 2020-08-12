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
