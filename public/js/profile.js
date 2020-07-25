const getUserTweets = function() {
  const url = '/user/getUserTweets';
  const id = document.querySelector('#profile-id').innerText.slice(1);
  sendPOSTRequest(url, { id }, ({ tweets }) => {
    tweets.forEach((tweet) => {
      const element = document.createElement('div');
      element.id = tweet.id;
      element.className = 'tweet';
      element.innerHTML = createTweetHtml(tweet, {
        name: tweet.name,
        image_url: tweet.image_url,
      });
      const allTweets = document.getElementById('tweets');
      allTweets.prepend(element);
    });
  });
};

const profileMain = function() {
  getUserTweets();
};
