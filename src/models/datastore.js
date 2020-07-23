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

class Datastore {
  constructor(db) {
    this.db = db;
  }

  postTweet(details) {
    const {userId, type, content} = details;
    const sql = `INSERT INTO Tweet(id,userID,_type,content) 
                  VALUES (?,${userId},"${type}","${content}")`;
    return runSql(sql, [], this.db.run.bind(this.db));
  }
}

module.exports = {Datastore};
