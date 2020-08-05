const searchOnEnter = function(searchBy) {
  if (event.keyCode === 13) {
    let url = `/user/searchProfile/${searchBy}`;
    let handler = showSearchUserProfile;
    if (searchBy[0] === '#') {
      url = `/user/searchHashtag/${searchBy.slice(1)}`;
      handler = showSearchTweets;
    }
    sendGETRequest(url, handler);
  }
};

const createProfileTemplate = function({ id, name, image_url }) {
  return `<div class="profileLink" onclick="getUserProfile('${id}')">
            <img src="${image_url}"/>
            <h3>${name}</h3><p>@${id}</p>
          </div>`;
};

const showSearchUserProfile = function(profiles) {
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML = profiles.reduce((html, profileInfo) => {
    const profileTemplate = createProfileTemplate(profileInfo);
    return html + profileTemplate;
  }, '');
};

const serveHashtag = function(word) {
  event.stopPropagation();
  const url = `/user/searchHashtag/${word.slice(1)}`;
  sendGETRequest(url, showSearchTweets);
};

const showSearchTweets = function(tweets) {
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML = tweets.reduce((html, tweet) => {
    const tweetTemplate = createTweetHtml(tweet);
    return html + tweetTemplate;
  }, '');
};

const getUserProfile = function(id) {
  location.assign(`/user/profile/${id}`);
};
