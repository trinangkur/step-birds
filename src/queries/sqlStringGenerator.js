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

const getTweetSql = function(userId, loggedInUser) {
  return `with tweets as
  (SELECT 
    t2.id as user_id
    ,t2.name as userName
    ,t1.id as tweet_id
    ,t1.content
    ,t1.timeStamp
    ,t1.likeCount
    ,t1.replyCount
    ,t2.image_url
    FROM Tweet t1 LEFT JOIN Tweeter t2 
    on t2.id is t1.userId 
    where t1.userId is '${userId}')
    SELECT *,
      CASE 
        WHEN tweets.tweet_id is Likes.tweetId
        and Likes.userId is '${loggedInUser}'
        then 'true'
        else 'false'
        end status
    FROM tweets LEFT JOIN Likes
    on Likes.userId='${loggedInUser}' 
    and Likes.tweetId=tweets.tweet_id;`;
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
