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
  getFollowersQuery,
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
    const { userId, type, content, timeStamp } = details;
    const columns = 'id ,userId, _type, content, timeStamp';
    const values = `?,"${userId}", "${type}", "${content}", "${timeStamp}"`;
    const queryString = getInsertionQuery('Tweet', columns, values);
    return this.runQuery(queryString, []);
  }

  deleteTweet(details) {
    const { tweetId } = details;
    const queryString = getDeleteQuery('Tweet', `id = "${tweetId}"`);
    return this.runQuery(queryString, []);
  }

  getUserTweets(userId, loggedInUser) {
    const queryString = getTweetQuery(userId, loggedInUser);
    return this.getAllRows(queryString, []);
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
        .then(() => resolve('followed'))
        .catch((err) => {
          if (err.code === 'SQLITE_CONSTRAINT') {
            const removeFollowerSql = getRemoveFollowerQuery(tweeterId, userId);
            this.executeTransaction(removeFollowerSql).then(() =>
              resolve('unFollowed')
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

  getFollowers(userId) {
    const queryString = getFollowersQuery(userId);
    return this.getAllRows(queryString, []);
  }
}

module.exports = { DataStore };
