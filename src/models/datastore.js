const {
  getInsertionSql,
  getDeleteSql,
  getSelectSql,
  getTweetSql,
  getProfileSearchSql,
  getIncreaseLikesSql,
  getDecreaseLikesSql
} = require('../queries/sqlStringGenerator');

class DataStore {
  constructor(db) {
    this.db = db;
  }

  runSql(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, err => {
        if (err) {
          reject(err);
        }
        resolve('OK');
      });
    });
  }

  getAllRows(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
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
        this.db.exec('COMMIT');
        resolve('OK');
      });
    });
  }

  addTweeter(details) {
    const {login, avatar_url, name} = details;
    const columns = 'id, image_url, name';
    const values = `"${login}", "${avatar_url}", "${name}"`;
    const sql = getInsertionSql('Tweeter', columns, values);
    return new Promise((res, rej) => {
      this.runSql(sql, [])
        .then(res)
        .catch(err => {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res('already have an account');
          }
          rej(err);
        });
    });
  }

  postTweet(details) {
    const {userId, type, content} = details;
    const columns = 'id ,userId, _type, content,reference';
    const values = `?,"${userId}", "${type}", "${content}",NULL`;
    const sql = getInsertionSql('Tweet', columns, values);
    return this.runSql(sql, []);
  }

  deleteTweet(details) {
    const {tweetId} = details;
    const sql = getDeleteSql('Tweet', `id = "${tweetId}"`);
    return this.runSql(sql, []);
  }

  getUserTweets(userId) {
    const sql = getTweetSql(userId);
    return this.getAllRows(sql, []);
  }

  getUserProfiles(name) {
    const sql = getProfileSearchSql(name);
    return this.getAllRows(sql, []);
  }

  getUserInfo(userId) {
    const sql = getSelectSql('Tweeter', {
      columns: ['name', 'image_url', 'id'],
      condition: `id="${userId}"`
    });

    return this.getAllRows(sql, []);
  }

  updateLikes(tweetId, userId) {
    return new Promise(res => {
      const increaseLikeSql = getIncreaseLikesSql(tweetId, userId);
      this.executeTransaction(increaseLikeSql)
        .then(() => res('liked'))
        .catch(() => {
          const decreaseLikeSql = getDecreaseLikesSql(tweetId, userId);
          this.executeTransaction(decreaseLikeSql).then(() => res('unLiked'));
        });
    });
  }
}

module.exports = {DataStore};
