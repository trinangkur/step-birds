const {
  getInsertionSql,
  getSelectSql,
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

  postTweet(details) {
    const {userId, type, content} = details;
    const columns = 'id ,userId, _type, content,reference';
    const values = `?,"${userId}", "${type}", "${content}",NULL`;
    const sql = getInsertionSql('Tweet', columns, values);
    return runSql(sql, [], this.db.all.bind(this.db));
  }

  getTweet(details) {
    const sql = getSelectSql('Tweet', details);
    return runSql(sql, [], this.db.all.bind(this.db));
  }
}

module.exports = {DataStore};
