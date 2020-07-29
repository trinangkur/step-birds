const getUserTweets = function() {
  const url = '/user/getUserTweets';
  const id = document.querySelector('#profile-id').innerText.slice(1);
  sendPOSTRequest(url, {id}, tweets => {
    tweets.forEach(showTweet);
  });
};

const showFollow = function(userOption) {
  userOption.value = 'Unfollow';
  const followers = document.querySelector('#follower-count');
  const followersCount = Number(followers.innerText);
  followers.innerText = followersCount + 1;
};

const showUnfollow = function(userOption) {
  userOption.value = 'Follow';
  const followers = document.querySelector('#follower-count');
  const followersCount = Number(followers.innerText);
  followers.innerText = followersCount - 1;
};

const openEditor = function() {
  document.querySelector('#editor').style.display = 'block';
};

const userOptions = function(userOption) {
  if (userOption.value !== 'Edit Profile') {
    const tweeter = document.querySelector('#profile-id').innerText.slice(1);
    const url = '/user/toggleFollowRequest';
    const lookup = {
      followed: showFollow.bind(null, userOption),
      unFollowed: showUnfollow.bind(null, userOption)
    };
    sendPOSTRequest(url, {tweeter}, ({status}) => {
      lookup[status]();
    });
  } else {
    openEditor();
  }
};

const closeEditor = function() {
  document.querySelector('#editor').style.display = 'none';
};

const updateProfile = function() {
  const name = document.querySelector('#name').value;
  const bio = document.querySelector('#bio').value;
  const url = '/user/updateProfile';
  sendPOSTRequest(url, {name, bio}, ({status}) => {
    if (status) {
      location.reload();
    }
  });
};

const main = function() {
  getUserTweets();
};
