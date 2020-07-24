const {
  getInsertionSql,
  getSelectSql,
  getDeleteSql,
} = require('../queries/sqlStringGenerator');

const runSql = (sql, params, runner) => {
  return new Promise((resolve, reject) => {
    runner(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

class DataStore {
  constructor(db) {
    this.db = db;
  }

  runSql(sql, params) {
    return new Promise((res, rej) => {
      this.db.run(sql, params, (err) => {
        if (err) {
          rej(err);
        }
        res('OK');
      });
    });
  }

  addTweeter(details) {
    const { login, avatar_url, name } = details;
    const columns = 'id, image_url, name';
    const values = `"${login}", "${avatar_url}", "${name}"`;
    const sql = getInsertionSql('Tweeter', columns, values);
    return new Promise((res, rej) => {
      this.runSql(sql, [])
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
    const { userId, type, content } = details;
    const columns = 'id ,userId, _type, content,reference';
    const values = `?,"${userId}", "${type}", "${content}",NULL`;
    const sql = getInsertionSql('Tweet', columns, values);
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  getTweet(details) {
    const sql = getSelectSql('Tweet', details);
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  deleteTweet(details) {
    const { tweetId } = details;
    const sql = getDeleteSql('Tweet', `id = "${tweetId}"`);
    return runSql(sql, [], this.db.all.bind(this.db));
  }
}

module.exports = { DataStore };
