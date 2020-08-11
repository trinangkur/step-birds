const {
  getInsertionQuery,
  getDeleteTweetQuery,
  getSelectQuery,
  getTweetQuery,
  getAddFollowerQuery,
  getRemoveFollowerQuery,
  getProfileInfoQuery,
  getAllTweetsQuery,
  getUpdateProfileQuery,
  getSpecificTweetQuery,
  getRepliesQuery,
  getProfileTweetsQuery,
  getFollowListQuery,
  getIncreaseQuery,
  getDecreaseQuery,
  getActionByQuery,
  getInsertTagQuery,
  getSearchHashtagQuery,
  getResponseInsertionQuery
} = require('../queries/queryStringGenerator');

const filterBy = function(symbol, text) {
  const pattern = new RegExp(`${symbol}[A-Z]+`, 'ig');
  return text.match(pattern);
};

class DataStore {
  constructor(db, newDb) {
    this.db = db;
    this.newDb = newDb;
  }

  runQuery(queryString, params) {
    return new Promise((resolve, reject) => {
      this.db.run(queryString, params, err => {
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
      this.db.exec(transaction, err => {
        if (err) {
          this.db.exec('ROLLBACK');
          return reject(err);
        }
        this.db.exec('COMMIT', err => {
          if (err) {
            reject(err);
          }
          resolve('OK');
        });
      });
    });
  }

  addTweeter(details) {
    const {login, avatar_url, name} = details;
    return new Promise((res, rej) => {
      this.newDb('Tweeter')
        .insert({id: login, image_url: avatar_url, name: name})
        .then(() => res(true))
        .catch(err => {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res('already have an account');
          }
          rej(err);
        });
    });
  }

  add(queryExecuter, query, field, content) {
    const hashTags = filterBy('#', content);
    const mentions = filterBy('@', content);
    return new Promise(res => {
      queryExecuter(query).then(() => {
        this.getAllRows(getSelectQuery('Tweet', field)).then(([{id}]) => {
          let query = 'BEGIN TRANSACTION;';
          if (hashTags) {
            query += getInsertTagQuery('Hashes', id, hashTags, 'tag');
          }
          if (mentions) {
            query += getInsertTagQuery('Mentions', id, mentions, 'userId');
          }
          this.executeTransaction(query).then(() => res(true));
          res(true);
        });
      });
    });
  }

  postResponse(details) {
    const {userId, type, content, timeStamp, reference} = details;
    const columns = 'id ,userId, _type, content, timeStamp, reference';
    const values = `?,"${userId}", "${type}", "${content}", "${timeStamp}",
     "${reference}"`;
    const condition = `content='${content}' AND timestamp='${timeStamp}'
                       AND _type='${type}';`;
    const field = {columns: ['id'], condition};
    if (type === 'tweet') {
      const queryString = getInsertionQuery('Tweet', columns, values);
      return this.add(this.runQuery.bind(this), queryString, field, content);
    }
    const queryString = getResponseInsertionQuery(
      columns,
      values,
      reference,
      type
    );
    return this.add(
      this.executeTransaction.bind(this),
      queryString,
      field,
      content
    );
  }

  deleteTweet(tweetId, reference, type) {
    const queryString = getDeleteTweetQuery(tweetId, reference, type);
    return this.executeTransaction(queryString, []);
  }

  getUserProfiles(name) {
    const condition = `id like "%${name}%" OR name like "%${name}%"`;
    const columns = ['id', 'name', 'image_url'];
    const queryString = getSelectQuery('Tweeter', {columns, condition});
    return this.getAllRows(queryString, []);
  }

  getUserInfo(userId) {
    const queryString = getSelectQuery('Tweeter', {
      columns: ['*'],
      condition: `id="${userId}"`
    });

    return this.getAllRows(queryString, []);
  }

  toggleFollow(tweeterId, userId) {
    return new Promise((resolve, reject) => {
      const addFollowerSql = getAddFollowerQuery(tweeterId, userId);

      this.executeTransaction(addFollowerSql)
        .then(() => resolve(true))
        .catch(err => {
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

  getParent(tweetId, userId) {
    const queryString = getSpecificTweetQuery(tweetId, userId);
    return this.getAllRows(queryString, []);
  }

  async getAllTweets(userId) {
    const queryString = getAllTweetsQuery(userId);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  updateProfile(userId, name, bio) {
    const queryString = getUpdateProfileQuery(userId, name, bio);
    return this.runQuery(queryString, []);
  }

  getFollow(listName, userId) {
    const queryString = getFollowListQuery(listName, userId);
    return this.getAllRows(queryString, []);
  }

  async getUserTweets(userId, loggedInUser) {
    const queryString = getTweetQuery(userId, loggedInUser);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  getActivitySpecificTweets(userId, activity, loggedInUser) {
    if (activity === 'tweets') {
      return this.getUserTweets(userId, loggedInUser);
    }

    const queryString = getProfileTweetsQuery(userId, activity, loggedInUser);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  async getTweetWithParentDetail(queryString, userId) {
    const tweets = await this.getAllRows(queryString, []);
    const posts = [];
    for (const tweet of tweets) {
      const [reference] = await this.getParent(tweet.reference, userId);
      posts.push({tweet, reference});
    }
    return posts;
  }

  getTweet(tweetId, userId) {
    const queryString = getSpecificTweetQuery(tweetId, userId);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  getActionBy(tweetId, table) {
    const queryString = getActionByQuery(tweetId, table);
    return this.getAllRows(queryString, []);
  }

  getReplies(tweetId) {
    const queryString = getRepliesQuery(tweetId);
    return this.getAllRows(queryString, []);
  }

  updateAction(tweetId, userId, table, field) {
    return new Promise(res => {
      const increaseLikeSql = getIncreaseQuery(tweetId, userId, table, field);
      this.executeTransaction(increaseLikeSql)
        .then(() => res(true))
        .catch(() => {
          const decreaseLikeSql = getDecreaseQuery(
            tweetId,
            userId,
            table,
            field
          );
          this.executeTransaction(decreaseLikeSql).then(() => res(false));
        });
    });
  }

  searchHashtag(hashTag, loggedInUser) {
    const queryString = getSearchHashtagQuery(hashTag, loggedInUser);
    return this.getTweetWithParentDetail(queryString, loggedInUser);
  }

  getMatchingTags(tag) {
    const condition = tag !== '*' ? `tag like "%${tag}%"` : 'tag like "%"';
    const queryString = getSelectQuery('Hashes', {
      columns: ['DISTINCT(tag)'],
      condition
    });
    return this.getAllRows(queryString, []);
  }

  getLatestRetweet(userId) {
    return new Promise(res => {
      const queryString = getTweetQuery(userId, userId);
      this.getAllRows(queryString, []).then(tweets => {
        const retweet = tweets[tweets.length - 1];
        const queryString = getSpecificTweetQuery(retweet.reference, userId);
        this.getAllRows(queryString, []).then(([tweet]) => {
          res({retweet, tweet});
        });
      });
    });
  }
}

module.exports = {DataStore};
