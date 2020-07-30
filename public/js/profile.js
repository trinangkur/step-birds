const getUserTweets = function () {
  const url = '/user/getUserTweets';
  const id = document.querySelector('#profile-id').innerText.slice(1);
  sendPOSTRequest(url, { id }, (tweets) => {
    document.querySelector('#tweets').innerHTML = '';
    tweets.forEach((tweet) => {
      showTweet(tweet, 'tweets');
    });
  });
};

const showFollow = function (userOption) {
  userOption.value = 'Unfollow';
  const followers = document.querySelector('#follower-count');
  const followersCount = Number(followers.innerText);
  followers.innerText = followersCount + 1;
};

const showUnfollow = function (userOption) {
  userOption.value = 'Follow';
  const followers = document.querySelector('#follower-count');
  const followersCount = Number(followers.innerText);
  followers.innerText = followersCount - 1;
};

const openEditor = function () {
  document.querySelector('#editor').style.display = 'block';
};

const userOptions = function (userOption) {
  if (userOption.value !== 'Edit Profile') {
    const tweeter = document.querySelector('#profile-id').innerText.slice(1);
    const url = '/user/toggleFollowRequest';
    const lookup = {
      followed: showFollow.bind(null, userOption),
      unFollowed: showUnfollow.bind(null, userOption),
    };
    sendPOSTRequest(url, { tweeter }, ({ status }) => {
      lookup[status]();
    });
  } else {
    openEditor();
  }
};

const closeEditor = function () {
  document.querySelector('#editor').style.display = 'none';
};

const updateProfile = function () {
  const name = document.querySelector('#name').value;
  const bio = document.querySelector('#bio').value;
  const url = '/user/updateProfile';
  sendPOSTRequest(url, { name, bio }, ({ status }) => {
    if (status) {
      location.reload();
    }
  });
};

const showFollowersList = function (userId) {
  location.assign(`/user/followers/${userId}`);
};

const showFollowingList = function (userId) {
  location.assign(`/user/followings/${userId}`);
};

const getLikedTweets = function () {
  const id = document.querySelector('#profile-id').innerText.slice(1);
  const url = '/user/getLikedTweets';
  sendPOSTRequest(url, { id }, (tweets) => {
    document.querySelector('#likes').innerHTML = '';
    tweets.forEach((tweet) => {
      showTweet(tweet, 'likes');
    });
  });
};

const indicate = function(id) {
  const element = document.querySelector(`#${id}`);
  element.classList.add('indicator');
};

const removeIndication = function(id) {
  const element = document.querySelector(`#${id}`);
  element.classList.remove('indicator');
};

const show = function(elementId) {
  const element = document.querySelector(`#${elementId}`);
  element.classList.remove('hide');
  element.classList.add('show');
};

const hide = function (elementId) {
  const element = document.querySelector(`#${elementId}`);
  element.classList.add('hide');
  element.classList.remove('show');
};

const showUserLikedTweets = function () {
  hide('tweets');
  hide('tweets-and-replies');
  show('likes');
  indicate('user-likes');
  removeIndication('user-tweets');
  removeIndication('user-tweets-and-replies');
};

const showUserTweetsAndReplies = function() {
  hide('likes');
  hide('tweets-and-replies');
  show('tweets');
  indicate('user-tweets-and-replies');
  removeIndication('user-likes');
  removeIndication('user-tweets');
};

const showUserTweets = function () {
  hide('likes');
  hide('tweets-and-replies');
  show('tweets');

  indicate('user-tweets');
  removeIndication('user-likes');
  removeIndication('user-tweets-and-replies');
};

const showIndicator = function() {};

const main = function() {
  getUserTweets();
  getLikedTweets();
};

setInterval(main, 5000);
