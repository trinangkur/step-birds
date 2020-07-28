const showOptions = function(isUsersTweet, id) {
  return isUsersTweet
    ? `<div class="options" id="tweetId-${id}" 
    onmouseleave="hideOptions(${id})">
    <div class="delete-tweet" onclick="deleteTweet(${id})">
      <span>Delete</span>
      <img src="/assets/delete.png" alt="N/A"> 
    </div>`
    : '';
};

const createTweetHtml = function(tweet) {
  const {content, tweet_id, isUsersTweet, likeCount} = tweet;
  const {user_id, image_url, userName} = tweet;
  return `<div class="userId">
            <div class="profilePart">
                <div>
                  <img src="${image_url}" alt="not found"/>
                </div>
                <div class="userName">
                  <span>${userName} </span> 
                  <span style="color:gray;font-size:1vw">@${user_id}</span>
                </div>
            </div>
            <div class="optionsButton">
             <img src="/assets/options.jpeg"
             onclick="showTweetOptions(${tweet_id})"/>
            </div>
          </div>
          <div class="content">
            <p>${content}</p>
          </div>
          ${showOptions(isUsersTweet, tweet_id)}
          </div>
          <div>
            <button type="button" onclick="updateLikes('${tweet_id}')">
            like
            </button><span id="likeCount-${tweet_id}">${likeCount}</span>
          </div>`;
};

const updateLikes = function(tweetId) {
  const url = '/user/updateLikes';
  sendPOSTRequest(url, {tweetId}, ({message}) => {
    document.querySelector(`#likeCount-${tweetId}`).innerText = message;
  });
};

const showTweet = function(tweet) {
  const element = document.createElement('div');
  element.id = tweet.tweet_id;
  element.className = 'tweet';
  element.innerHTML = createTweetHtml(tweet);
  const allTweets = document.getElementById('tweets');
  allTweets.prepend(element);
};

const getLatestTweet = function(res) {
  if (res.message === 'successful') {
    const url = '/user/getLatestTweet';
    sendGETRequest(url, ({message, tweet}) => {
      const pageUserId = document.querySelector('#tweets').getAttribute('name');
      if (message === 'successful' && pageUserId === tweet.user_id) {
        showTweet(tweet);
      }
    });
  }
};

const postTweet = function(boxId) {
  const tweetText = document.getElementById(`tweetText${boxId}`);
  const url = '/user/postTweet';
  if (tweetText.value) {
    const body = {content: tweetText.value};
    sendPOSTRequest(url, body, getLatestTweet);
    tweetText.value = '';
    closeTweetPopUp();
  }
};

const getAllTweets = function(id) {
  const url = '/user/getUserTweets';
  sendPOSTRequest(url, {id}, ({tweets}) => {
    tweets.forEach(tweet => {
      showTweet(tweet);
    });
  });
};

const showTweetOptions = function(id) {
  document.getElementById(`tweetId-${id}`).style.display = 'block';
};

const updateTweets = function(id, {message}) {
  if (message === 'successful') {
    const element = document.getElementById(id);
    element.parentNode.removeChild(element);
  }
};

const deleteTweet = function(tweetId) {
  const url = '/user/deleteTweet';
  const body = {tweetId};
  sendPOSTRequest(url, body, res => updateTweets(tweetId, res));
};

const getUserProfile = function(id) {
  location.assign(`/user/profile/${id}`);
};

const createProfileTemplate = function({id, name, image_url}) {
  return `<div class="profileLink" onclick="getUserProfile('${id}')">
            <img src="${image_url}"/>
            <h3>${name}</h3><p>@${id}</p></div>`;
};

const showSearchUserProfile = function(profiles) {
  const contentBox = document.getElementById('contentBox');
  contentBox.innerHTML = profiles.reduce((html, profileInfo) => {
    const profileTemplate = createProfileTemplate(profileInfo);
    return html + profileTemplate;
  }, '');
};

const searchOnEnter = function(name) {
  if (event.keyCode === 13) {
    sendPOSTRequest('/user/searchProfile', {name}, showSearchUserProfile);
  }
};

const hideOptions = function(id) {
  document.getElementById(`tweetId-${id}`).style.display = 'none';
};

const showTweetPopUp = function() {
  document.getElementById('tweetPopUp').style.display = 'block';
};

const closeTweetPopUp = function() {
  document.getElementById('tweetPopUp').style.display = 'none';
};

const assignHome = function() {
  location.assign('/user/home');
};

const assignProfile = function() {
  handleRedirectedRequest('/user/showProfile');
};

const changeColour = function(countIndicatorId, strokeSize, colour) {
  const startingStrokeSize = 56;
  const circleElement = document.querySelector(`#${countIndicatorId}`);

  circleElement.style.strokeDashoffset = startingStrokeSize - strokeSize;
  circleElement.style.stroke = colour;
};

const maxLength = 180;

const indicateCountByColour = function(countIndicatorId, charCount) {
  const startingSize = 56;

  if (charCount > maxLength) {
    const strokeSize = (charCount - maxLength) * (startingSize / maxLength);
    changeColour(countIndicatorId, strokeSize, 'rgb(198, 23, 23)');
    return;
  }
  const strokeSize = charCount * (startingSize / maxLength);
  changeColour(countIndicatorId, strokeSize, '#4a61c8');
};

const toggleClickEvent = function(tweetElementId, charCount) {
  const buttonElement = document.querySelector(`#${tweetElementId}`).firstChild;

  if (charCount > maxLength) {
    buttonElement.classList.add('remove-access');
    buttonElement.classList.remove('add-access');
    return;
  }
  buttonElement.classList.add('add-access');
  buttonElement.classList.remove('remove-access');
};

const showCharCount = (textBoxId, countIndicatorId, counterId, tweetId) => {
  const charCount = document.querySelector(`#${textBoxId}`).value.length;
  indicateCountByColour(countIndicatorId, charCount);
  toggleClickEvent(tweetId, charCount);
  const numberElement = document.querySelector(`#${counterId}`);
  numberElement.innerHTML = maxLength - charCount;
};
