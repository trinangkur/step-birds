const select = document.querySelector.bind(document);

const toggleFollow = function(userOption, status) {
  let value = 'Follow';
  let count = -1;
  if (status) {
    value = 'Unfollow';
    count = 1;
  }
  userOption.value = value;
  const followers = select('#follower-count');
  const followersCount = Number(followers.innerText);
  followers.innerText = followersCount + count;
};

const userOptions = function(userOption) {
  if (userOption.value !== 'Edit Profile') {
    const tweeter = select('#profile-id').innerText.slice(1);
    const url = '/user/toggleFollowRequest';
    sendPOSTRequest(url, { tweeter }, ({ status }) => {
      toggleFollow(userOption, status);
    });
  } else {
    show('editor');
  }
};

const updateProfile = function() {
  const name = select('#name').value;
  const bio = select('#bio').value;
  const url = '/user/updateProfile';
  sendPOSTRequest(url, { name, bio }, ({ status }) => {
    if (status) {
      location.reload();
    }
  });
};

const showFollowList = function(listName, userId) {
  location.assign(`/user/followList/${listName}/${userId}`);
};

const showRetweets = function(id) {
  const elements = document.querySelectorAll(`#${id}`);
  elements.forEach((element) => {
    element.classList.remove('hide');
    element.classList.add('show');
  });
};

const getActivitySpecificTweets = function(activity) {
  const id = select('#profile-id').innerText.slice(1);
  const url = '/user/getActivitySpecificTweets';
  sendPOSTRequest(url, { id, activity }, (tweets) => {
    select('#tweets').innerHTML = '';
    tweets.forEach(({ tweet, reference }) => {
      showTweet(tweet, 'tweets', reference);
    });
  });
};

const indicate = function(id) {
  const element = select(`#${id}`);
  element.classList.add('indicator');
};

const removeIndication = function(id) {
  const element = select(`#${id}`);
  element.classList.remove('indicator');
};

const showUserActivities = function(toBeShow) {
  const activities = ['tweets', 'retweets', 'likes'];
  activities.forEach((activity) => {
    removeIndication(`user-${activity}`);
  });
  getActivitySpecificTweets(toBeShow);
  indicate(`user-${toBeShow}`);
};

const main = function() {
  getActivitySpecificTweets('tweets');
};
