const getInsertionSql = function(table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteSql = function(table, condition) {
  return `DELETE FROM ${table} WHERE ${condition}`;
};

const getSelectSql = function(table, {columns, condition}) {
  let sql = `SELECT ${columns.join(',')} FROM ${table}`;
  sql += condition ? ` WHERE ${condition}` : '';
  return sql;
};

const getProfileSearchSql = function(name) {
  return `SELECT id, name, image_url FROM Tweeter
  WHERE id like "%${name}%" OR name like "%${name}%"`;
};

const getTweetSql = function(userId) {
  return `select *, Tweet.id as id
    from Tweet
    left join Tweeter
      on Tweet.userId = Tweeter.id
      where userId is '${userId}';`;
};

const getIncreaseLikesSql = function(tweetId, userId) {
  return `BEGIN TRANSACTION;
  INSERT INTO Likes (tweetId,userId) 
    VALUES('${tweetId}','${userId}');
  UPDATE Tweet
    SET likeCount=likeCount + 1
    WHERE id is ${tweetId};`;
};

const getDecreaseLikesSql = function(tweetId, userId) {
  return `BEGIN TRANSACTION;
  DELETE FROM Likes
    WHERE userId = '${userId}' AND tweetId='${tweetId}';
  UPDATE Tweet
    SET likeCount=likeCount - 1
    WHERE id is '${tweetId}';`;
};

module.exports = {
  getInsertionSql,
  getDeleteSql,
  getProfileSearchSql,
  getSelectSql,
  getTweetSql,
  getIncreaseLikesSql,
  getDecreaseLikesSql
};
