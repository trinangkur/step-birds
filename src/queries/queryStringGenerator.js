const getInsertTagQuery = function(table, tweetId, tags, field) {
  const query = `INSERT INTO ${table} (tweetId,${field}) VALUES `;
  const values = tags.map(tag => `(${tweetId}, '${tag.slice(1)}')`);
  return query + values.join(',') + ';';
};

const getInsertionQuery = function(table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteQuery = function(table, condition) {
  return `DELETE FROM ${table}
    WHERE ${condition};`;
};

const getDeleteTweetQuery = function(tweetId, reference, type) {
  const conditionOfTweet = `id = ${tweetId} or reference = ${tweetId}`;
  const conditionOfAction = `tweetId = ${tweetId}`;
  let query = `BEGIN TRANSACTION;
  ${getDeleteQuery('Tweet', conditionOfTweet)}
  ${getDeleteQuery('Likes', conditionOfAction)}
  ${getDeleteQuery('Retweets', conditionOfAction)}`;

  if (type !== 'tweet') {
    query += ` UPDATE Tweet
    SET ${type}Count = ${type}Count -1
    WHERE id = '${reference}'`;
  }

  return query;
};

const getSelectQuery = function(table, {columns, condition}) {
  return `SELECT ${columns.join(',')} FROM ${table}
             WHERE ${condition}`;
};

const createUserProjection = function(condition, t1, t2) {
  return `
  SELECT DISTINCT(${t1}.id)
          ,${t1}.userId AS userId
          ,${t1}._type AS _type
          ,${t1}.reference AS reference
          ,${t1}.timeStamp AS timeStamp
          ,${t1}.content AS content
          ,${t1}.replyCount AS replyCount
          ,${t1}.retweetCount AS retweetCount
          ,${t1}.likeCount AS likeCount 
          ,${t2}.name AS name
          ,${t2}.image_url AS image_url
          ,${t1}.isLiked as isLiked
          ,${t1}.isRetweeted as isRetweeted
    FROM ${t1} LEFT JOIN ${t2}
    ${condition}`;
};

const getSearchHashtagQuery = function(hashtag, loggedInUser) {
  return `with details as (with tweets as(SELECT *
          FROM Hashes LEFT JOIN Tweet
          ON Hashes.tweetId = Tweet.id
          WHERE tag is '${hashtag}') 
          SELECT * from tweets left join Tweeter
          on tweets.userId is Tweeter.id
          ) ${getUserAction(loggedInUser, 'details')}`;
};

const getUserAction = function(loggedInUser, table) {
  return `SELECT *, ${table}.userId as userId,
      CASE 
        WHEN ${table}.id is Likes.tweetId
        and Likes.userId is '${loggedInUser}'
        then 'true'
        else 'false'
      end isLiked,
      CASE 
        WHEN ${table}.id is Retweets.tweetId
        and Retweets.userId is '${loggedInUser}'
        then 'true'
        else 'false'
      end isRetweeted
    FROM ${table} LEFT JOIN Likes
    on Likes.userId='${loggedInUser}' 
    and Likes.tweetId=${table}.id
    Left Join Retweets
    on Retweets.userId='${loggedInUser}'
    and Retweets.tweetId=${table}.id`;
};

const getTweetQuery = function(userId, loggedInUser) {
  const t1 = 'Tweets';
  const t2 = 'Tweeter';
  const condition = `ON Tweeter.id is ${t1}.userId
      WHERE ${t1}.userId IS '${userId}'
      AND ${t1}._type IS "tweet" OR ${t1}._type IS "retweet"`;
  return `WITH ${t1} AS
          (${getUserAction(loggedInUser, 'Tweet')})
          ${createUserProjection(condition, t1, t2)}`;
};

const getProfileTweetsQuery = function(userId, activityTable, loggedInUser) {
  const t1 = 'Tweets';
  const t2 = 'Tweeter';
  const t3 = 'homeDetails';
  const condition = `ON ${t3}.userId = ${t2}.id`;
  return `WITH ${t3} AS (WITH ${t1} as (
    SELECT Tweet.userId as userId,* FROM ${activityTable}
    LEFT JOIN Tweet ON Tweet.id = ${activityTable}.tweetId
    WHERE ${activityTable}.userId = '${userId}')
    ${getUserAction(loggedInUser, t1)})
    ${createUserProjection(condition, t3, t2)}`;
};

const getFollowQuery = function(tweeterId, userId, operator) {
  return `BEGIN TRANSACTION;
          UPDATE Tweeter
          SET followersCount=followersCount ${operator} 1
          WHERE id is '${tweeterId}';
          UPDATE Tweeter
          SET followingCount=followingCount ${operator} 1
            WHERE id is '${userId}'; `;
};

const getAddFollowerQuery = function(tweeterId, userId) {
  const followQuery = getFollowQuery(tweeterId, userId, '+');
  return (
    followQuery +
    `INSERT INTO Followers (followerId, followingId)
            VALUES('${userId}', '${tweeterId}');`
  );
};

const getRemoveFollowerQuery = function(tweeterId, userId) {
  const condition = `followerId = '${userId}' AND followingId = '${tweeterId}'`;
  const followQuery = getFollowQuery(tweeterId, userId, '-');
  return followQuery + getDeleteQuery('Followers', condition);
};

const getProfileInfoQuery = function(tweeterId, userId) {
  return `SELECT *,
            CASE
              WHEN Tweeter.id = '${userId}'
              THEN 'Edit Profile'
              WHEN Tweeter.id = Followers.followingId
                AND Followers.followerId = '${userId}'
              THEN 'Unfollow'
              ELSE 'Follow'
              end userOption
          FROM Tweeter LEFT JOIN Followers
          on followers.followingId  = '${tweeterId}' 
          where Tweeter.id = '${tweeterId}'`;
};

const createTweetView = userId => `
    SELECT *
    FROM Tweet LEFT JOIN Followers
    ON Tweet.userId = Followers.followingId OR Tweet.userId = '${userId}'
    WHERE Followers.followerId = '${userId}' OR Tweet.userId = '${userId}'`;

const getAllTweetsQuery = function(userId) {
  const t1 = 'homeDetails';
  const t2 = 'Tweeter';
  const t3 = 'tweets';
  const condition = `ON ${t1}.userId = ${t2}.id
                    WHERE ${t1}._type = 'tweet' OR ${t1}._type = 'retweet'`;
  return `WITH ${t1} as (WITH ${t3} as (
            ${createTweetView(userId)}
          ) ${getUserAction(userId, t3)})
          ${createUserProjection(condition, t1, t2)}`;
};

const getUpdateProfileQuery = function(userId, name, bio) {
  return `UPDATE Tweeter SET name='${name}', bio='${bio}' where id='${userId}'`;
};

const getFollowListQuery = function(listName, userId) {
  let column = 'following';
  if (listName === column) {
    column = 'follower';
  }
  return `SELECT * FROM 
    Followers LEFT JOIN Tweeter
    ON Tweeter.id = Followers.${listName}Id
    WHERE Followers.${column}Id is '${userId}';`;
};

const getSpecificTweetQuery = function(tweetId, userId) {
  const t1 = 'Tweets';
  const t2 = 'Tweeter';
  const condition = `ON Tweeter.id is ${t1}.userId
      WHERE ${t1}.id IS ${tweetId}`;
  return `WITH ${t1} AS
          (${getUserAction(userId, 'Tweet')})
          ${createUserProjection(condition, t1, t2)}`;
};

const getActionByQuery = function(tweetId, table) {
  return `SELECT * from ${table} left join tweeter
  on Tweeter.id=${table}.userId
  where ${table}.tweetId is '${tweetId}'`;
};

const getResponseInsertionQuery = function(columns, values, tweetId, type) {
  return ` BEGIN TRANSACTION;
  ${getInsertionQuery('Tweet', columns, values)};
  UPDATE Tweet
  SET ${type}Count = ${type}Count + 1
  WHERE Tweet.id = '${tweetId}';`;
};

const getRepliesQuery = function(tweetId) {
  return `
  SELECT *, Tweet.id as id
    FROM Tweet LEFT JOIN Tweeter
    ON Tweet.userId = Tweeter.id
    WHERE Tweet._type is 'reply' AND Tweet.reference is '${tweetId}';`;
};

const updateActionCount = function(tweetId, field, operator) {
  return `UPDATE Tweet
            SET ${field}=${field} ${operator} 1
          WHERE id IS ${tweetId};`;
};

const getIncreaseQuery = function(tweetId, userId, table, field) {
  return `BEGIN TRANSACTION;
            INSERT INTO ${table} (tweetId,userId) 
            VALUES('${tweetId}','${userId}');
            ${updateActionCount(tweetId, field, '+')}`;
};

const getDecreaseQuery = function(tweetId, userId, table, field) {
  const condition = `userId = '${userId}' AND tweetId='${tweetId}';`;
  return `BEGIN TRANSACTION;
            ${getDeleteQuery(table, condition)}
            ${updateActionCount(tweetId, field, '-')}`;
};

module.exports = {
  getInsertionQuery,
  getDeleteTweetQuery,
  getSelectQuery,
  getTweetQuery,
  getAddFollowerQuery,
  getRemoveFollowerQuery,
  getProfileInfoQuery,
  getAllTweetsQuery,
  getUpdateProfileQuery,
  getFollowQuery,
  getSpecificTweetQuery,
  getResponseInsertionQuery,
  getRepliesQuery,
  getProfileTweetsQuery,
  getFollowListQuery,
  getIncreaseQuery,
  getDecreaseQuery,
  getActionByQuery,
  getInsertTagQuery,
  getSearchHashtagQuery
};
