const postTweet = function() {
  const tweetText = document.getElementById('tweetText');
  const url = '/user/postTweet';
  const body = {content: tweetText.value};
  sendPOSTRequest(url, body, () => {});
  tweetText.value = '';
};
