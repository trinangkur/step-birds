const showOptions = function(isUsersTweet, id) {
  return isUsersTweet
    ? `<div class="options" id="tweetId-${id}" 
  onmouseleave="hideOptions(${id})" onclick="deleteTweet(${id})" >
    <span>Delete</span>
  </div>`
    : '';
};

const createTweetsHtml = function(tweet) {
  const { content, userId, id, image_url, name, isUsersTweet } = tweet;
  return (
    `<div class="userId">
            <div class="profilePart">
                <div>
                  <img src="${image_url}" alt="not found"/>
                </div>
                <div class="userName">
                  <span>${name} </span> 
                  <span style="color:gray;font-size:1vw">@${userId}</span>
                </div>
            </div>
            <div class="optionsButton">
             <img src="/assets/options.jpeg" onclick="showTweetOptions(${id})"/>
            </div>
          </div>
          <div class="content">
            <p>${content}</p>
          </div>
          ` + showOptions(isUsersTweet, id)
  );
};

const getUserTweets = function() {
  const url = '/user/getUserTweets';
  const id = document.querySelector('#profile-id').innerText.slice(1);
  sendPOSTRequest(url, {id}, ({tweets}) => {
    tweets.forEach(tweet => {
      const element = document.createElement('div');
      element.id = tweet.id;
      element.className = 'tweet';
      element.innerHTML = createTweetsHtml(tweet);
      const allTweets = document.getElementById('tweets');
      allTweets.prepend(element);
    });
  });
};

const profileMain = function() {
  getUserTweets();
};
