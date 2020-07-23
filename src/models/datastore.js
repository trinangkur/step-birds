const {
  getInsertionSql,
  getSelectSql,
  enableForeignKeySql
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
    const columns = 'userId, _type, content';
    const values = `${userId}, "${type}", "${content}"`;
    let sql = enableForeignKeySql();
    sql += getInsertionSql('Tweet', columns, values);
    return runSql(sql, [], this.db.run.bind(this.db));
  }

  getTweet() {
    const sql = getSelectSql('Tweet', {columns: ['*']});
    return runSql(sql, [], this.db.all.bind(this.db));
  }
}

module.exports = {DataStore};
