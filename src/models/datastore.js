const {
  getInsertionQuery,
  getDeleteQuery,
  getSelectQuery,
  getTweetQuery,
  getProfileSearchQuery,
  getIncreaseLikesQuery,
  getDecreaseLikesQuery,
  getAddFollowerQuery,
  getRemoveFollowerQuery,
  getProfileInfoQuery,
  getAllTweetsQuery,
  getUpdateProfileQuery,
  getSpecificTweetQuery,
  getLikedByQuery,
  getRepliedTweetQuery,
  getReplyInsertionQuery,
  getRepliesQuery,
  getIncreaseRetweetsQuery,
  getDecreaseRetweetsQuery,
  getRetweetedByQuery,
  getProfileTweetsQuery,
  getFollowListQuery,
} = require('../queries/queryStringGenerator');

class DataStore {
  constructor(db) {
    this.db = db;
  }

  runQuery(queryString, params) {
    return new Promise((resolve, reject) => {
      this.db.run(queryString, params, (err) => {
        if (err) {
          reject(err);
        }
        resolve('OK');
      });
    });
  }

  getAllRows(queryString, params) {
    return new Promise((resolve, reject) => {
      this.db.all(queryString, params, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  executeTransaction(transaction) {
    return new Promise((resolve, reject) => {
      this.db.exec(transaction, (err) => {
        if (err) {
          this.db.exec('ROLLBACK');
          return reject(err);
        }
        this.db.exec('COMMIT');
        resolve('OK');
      });
    });
  }

  addTweeter(details) {
    const { login, avatar_url, name } = details;
    const columns = 'id, image_url, name';
    const values = `"${login}", "${avatar_url}", "${name}"`;
    const queryString = getInsertionQuery('Tweeter', columns, values);
    return new Promise((res, rej) => {
      this.runQuery(queryString, [])
        .then(res)
        .catch((err) => {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res('already have an account');
          }
          rej(err);
        });
    });
  }

  postTweet(details) {
    const { userId, type, content, timeStamp, reference } = details;
    const columns = 'id ,userId, _type, content, timeStamp, reference';
    const values = `?,"${userId}", "${type}", "${content}", "${timeStamp}",
     "${reference}"`;
    const queryString = getInsertionQuery('Tweet', columns, values);
    return this.runQuery(queryString, []);
  }

  deleteTweet(tweetId, reference, type) {
    const queryString = getDeleteQuery(tweetId, reference, type);
    return this.executeTransaction(queryString, []);
  }

  getUserProfiles(name) {
    const queryString = getProfileSearchQuery(name);
    return this.getAllRows(queryString, []);
  }

  getUserInfo(userId) {
    const queryString = getSelectQuery('Tweeter', {
      columns: ['*'],
      condition: `id="${userId}"`,
    });

    return this.getAllRows(queryString, []);
  }

  updateLikes(tweetId, userId) {
    return new Promise((res) => {
      const increaseLikeSql = getIncreaseLikesQuery(tweetId, userId);
      this.executeTransaction(increaseLikeSql)
        .then(() => res('liked'))
        .catch(() => {
          const decreaseLikeSql = getDecreaseLikesQuery(tweetId, userId);
          this.executeTransaction(decreaseLikeSql).then(() => res('unLiked'));
        });
    });
  }

  toggleFollow(tweeterId, userId) {
    return new Promise((resolve, reject) => {
      const addFollowerSql = getAddFollowerQuery(tweeterId, userId);

      this.executeTransaction(addFollowerSql)
        .then(() => resolve(true))
        .catch((err) => {
          if (err.code === 'SQLITE_CONSTRAINT') {
            const removeFollowerSql = getRemoveFollowerQuery(tweeterId, userId);
            this.executeTransaction(removeFollowerSql).then(() =>
              resolve(false)
            );
          } else {
            reject(err);
          }
        });
    });
  }

  getProfileInfo(tweeterId, userId) {
    const queryString = getProfileInfoQuery(tweeterId, userId);
    return this.getAllRows(queryString, []);
  }

  getAllTweets(userId, loggedInUser) {
    const queryString = getAllTweetsQuery(userId, loggedInUser);
    return this.getAllRows(queryString, []);
  }

  updateProfile(userId, name, bio) {
    const queryString = getUpdateProfileQuery(userId, name, bio);
    return this.runQuery(queryString, []);
  }

  getFollow(listName, userId) {
    const queryString = getFollowListQuery(listName, userId);
    return this.getAllRows(queryString, []);
  }

  getUserTweets(userId, loggedInUser) {
    const queryString = getTweetQuery(userId, loggedInUser);
    return this.getAllRows(queryString, []);
  }

  getActivitySpecificTweets(userId, activity, loggedInUser) {
    if (activity === 'tweets') {
      return this.getUserTweets(userId, loggedInUser);
    }

    const queryString = getProfileTweetsQuery(userId, activity, loggedInUser);
    return this.getAllRows(queryString, []);
  }

  getTweet(tweetId, userId) {
    const queryString = getSpecificTweetQuery(tweetId, userId);
    return this.getAllRows(queryString, []);
  }

  getLikedBy(tweetId) {
    const queryString = getLikedByQuery(tweetId);
    return this.getAllRows(queryString, []);
  }

  getRetweetedBy(tweetId) {
    const queryString = getRetweetedByQuery(tweetId);
    return this.getAllRows(queryString, []);
  }

  postReply(reply) {
    const { userId, type, content, timeStamp, tweetId } = reply;
    const columns = 'id ,userId, _type, content, timeStamp, reference';
    const values = `?,"${userId}", "${type}",
     "${content}", "${timeStamp}", "${tweetId}"`;

    const queryString = getReplyInsertionQuery(columns, values, tweetId);
    return this.executeTransaction(queryString, []);
  }

  getReplies(tweetId) {
    const queryString = getRepliesQuery(tweetId);
    return this.getAllRows(queryString, []);
  }

  getRepliedTweet(userId, loggedInUser) {
    const queryString = getRepliedTweetQuery(userId, loggedInUser);
    return this.getAllRows(queryString, []);
  }

  updateRetweets(tweetId, userId) {
    return new Promise((res) => {
      const increaseRetweetSql = getIncreaseRetweetsQuery(tweetId, userId);
      this.executeTransaction(increaseRetweetSql)
        .then(() => res(true))
        .catch(() => {
          const decreaseRetweetSql = getDecreaseRetweetsQuery(tweetId, userId);
          this.executeTransaction(decreaseRetweetSql).then(() => res(false));
        });
    });
  }
}

module.exports = { DataStore };
