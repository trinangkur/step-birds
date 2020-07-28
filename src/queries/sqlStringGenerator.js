const getInsertionSql = function (table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteSql = function (table, condition) {
  return `DELETE FROM ${table} WHERE ${condition}`;
};

const getSelectSql = function (table, { columns, condition }) {
  return `SELECT ${columns.join(',')} FROM ${table}
             WHERE ${condition}`;
};

const getProfileSearchSql = function (name) {
  return `SELECT id, name, image_url FROM Tweeter
  WHERE id like "%${name}%" OR name like "%${name}%"`;
};

const getTweetSql = function (userId) {
  return `select *, Tweet.id as id
    from Tweet
    left join Tweeter
      on Tweet.userId = Tweeter.id
      where userId is '${userId}';`;
};

const getIncreaseLikesSql = function (tweetId, userId) {
  return `BEGIN TRANSACTION;
  INSERT INTO Likes (tweetId,userId) 
    VALUES('${tweetId}','${userId}');
  UPDATE Tweet
    SET likeCount=likeCount + 1
    WHERE id is ${tweetId};`;
};

const getDecreaseLikesSql = function (tweetId, userId) {
  return `BEGIN TRANSACTION;
  DELETE FROM Likes
    WHERE userId = '${userId}' AND tweetId='${tweetId}';
  UPDATE Tweet
    SET likeCount=likeCount - 1
    WHERE id is '${tweetId}';`;
};

const getFollowSql = function (tweeterId, userId, operator) {
  return `BEGIN TRANSACTION;
          UPDATE Tweeter
          SET followersCount=followersCount ${operator} 1
          WHERE id is '${tweeterId}';
          UPDATE Tweeter
          SET followingCount=followingCount ${operator} 1
            WHERE id is '${userId}'; `;
};

const getAddFollowerSql = function (tweeterId, userId) {
  const followSql = getFollowSql(tweeterId, userId, '+');
  return (
    followSql +
    `INSERT INTO Followers (followerId, followingId)
            VALUES('${userId}', '${tweeterId}');`
  );
};

const getRemoveFollowerSql = function (tweeterId, userId) {
  const followSql = getFollowSql(tweeterId, userId, '-');
  return (
    followSql +
    `DELETE FROM Followers
              WHERE followerId = '${userId}' AND followingId = '${tweeterId}';`
  );
};

const getProfileInfoSql = function (tweeterId, userId) {
  return `SELECT *,
            CASE
              WHEN Tweeter.id = '${userId}'
              THEN 'edit profile'
              WHEN Tweeter.id = Followers.followingId
                AND Followers.followerId = '${userId}'
              THEN 'unfollow'
              ELSE 'follow'
              end userOption
          FROM Tweeter LEFT JOIN Followers
          on followers.followingId  = '${tweeterId}' 
          where Tweeter.id = '${tweeterId}'`;
};

module.exports = {
  getInsertionSql,
  getDeleteSql,
  getProfileSearchSql,
  getSelectSql,
  getTweetSql,
  getIncreaseLikesSql,
  getDecreaseLikesSql,
  getAddFollowerSql,
  getRemoveFollowerSql,
  getProfileInfoSql,
};
