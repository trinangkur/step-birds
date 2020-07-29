const getUserTweets = function () {
  const url = '/user/getUserTweets';
  const id = document.querySelector('#profile-id').innerText.slice(1);
  sendPOSTRequest(url, { id }, (tweets) => {
    tweets.forEach(showTweet);
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

const userOptions = function (userOption) {
  if (userOption.value !== 'edit profile') {
    const tweeter = document.querySelector('#profile-id').innerText.slice(1);
    const url = '/user/toggleFollowRequest';
    const lookup = {
      followed: showFollow.bind(null, userOption),
      unFollowed: showUnfollow.bind(null, userOption),
    };
    sendPOSTRequest(url, { tweeter }, ({ status }) => {
      lookup[status]();
    });
  }
};

const main = function () {
  getUserTweets();
};
