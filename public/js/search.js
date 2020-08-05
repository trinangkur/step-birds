const search = function() {
  const searchedBy = document.querySelector('#search-box').value;
  let url = `/user/searchProfile/${searchedBy}`;
  let handler = showSearchUserProfile;
  if (searchedBy[0] === '#') {
    const tag = searchedBy.slice(1) || '*';
    url = `/user/serveHashtag/${tag}`;
    handler = showSearchTweetsSuggestion;
  }
  sendGETRequest(url, handler);
};

const createProfileTemplate = function({id, name, image_url}) {
  return `<div class="suggestion" onclick="getUserProfile('${id}')">
            <img src="${image_url}"/>
            <h3>${name}</h3><p>@${id}</p>
          </div>`;
};

const showSearchUserProfile = function(profiles) {
  const contentBox = document.getElementById('suggestion-box');
  contentBox.innerHTML = profiles.reduce((html, profileInfo) => {
    const profileTemplate = createProfileTemplate(profileInfo);
    return html + profileTemplate;
  }, '');
};

const serveHashtag = function(word) {
  event.stopPropagation();
  const url = `/user/searchHashtag/${word.slice(1)}`;
  sendGETRequest(url, showSearchedTweets);
};

const showSearchTweetsSuggestion = function(tags) {
  const contentBox = document.getElementById('suggestion-box');

  contentBox.innerHTML = tags.reduce((html, {tag}) => {
    const tagTemplate = `<div class="suggestion" onclick="serveHashtag('#${tag}')"><span>#${tag}</span></div>`;
    return html + tagTemplate;
  }, '');
};

const showSearchedTweets = function(tweets) {
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML = tweets.reduce((html, tweet) => {
    const tweetTemplate = createTweetHtml(tweet);
    return html + tweetTemplate;
  }, '');
};

const getUserProfile = function(id) {
  location.assign(`/user/profile/${id}`);
};
