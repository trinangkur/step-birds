const {
  getInsertionSql,
  getDeleteSql
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

  all(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
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
}

module.exports = {DataStore};
