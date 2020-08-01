const getInsertionQuery = function(table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteQuery = function(tweetId, reference, type) {
  let query = `BEGIN TRANSACTION;
   DELETE FROM Tweet WHERE id = ${tweetId} or reference = ${tweetId}; 
   DELETE FROM Likes
    WHERE tweetId = ${tweetId};`;
  if (type !== 'tweet') {
    query += ` UPDATE Tweet
    SET ${type}Count = ${type}Count -1
    WHERE id = '${reference}' `;
  }
  return query;
};

const getSelectQuery = function(table, { columns, condition }) {
  return `SELECT ${columns.join(',')} FROM ${table}
             WHERE ${condition}`;
};

const getProfileSearchQuery = function(name) {
  return `SELECT id, name, image_url FROM Tweeter
  WHERE id like "%${name}%" OR name like "%${name}%"`;
};

const getUserAction = function(loggedInUser) {
  return `SELECT *, tweets.userId as userId,
      CASE 
        WHEN tweets.id is Likes.tweetId
        and Likes.userId is '${loggedInUser}'
        then 'true'
        else 'false'
      end isLiked,
      CASE 
        WHEN tweets.id is Retweet.tweetId
        and Retweet.userId is '${loggedInUser}'
        then 'true'
        else 'false'
      end isRetweeted
    FROM tweets LEFT JOIN Likes
    on Likes.userId='${loggedInUser}' 
    and Likes.tweetId=tweets.id
    Left Join Retweet
    on Retweet.userId='${loggedInUser}'
    and Retweet.tweetId=tweets.id`;
};

const getTweetQuery = function(userId, loggedInUser) {
  return `with tweets as
  (SELECT 
    t2.id as userId
    ,t2.name as name
    ,t1.id as id
    ,t1.content
    ,t1.timeStamp
    ,t1.likeCount
    ,t1.replyCount
    ,t1.retweetCount
    ,t2.image_url
    ,t1._type as type
    FROM Tweet t1 LEFT JOIN Tweeter t2 
    on t2.id is t1.userId 
    where t1.userId is '${userId}' 
    AND t1._type is "tweet") 
    ${getUserAction(loggedInUser)}
    `;
};

const getIncreaseLikesQuery = function(tweetId, userId) {
  return `BEGIN TRANSACTION;
  INSERT INTO Likes (tweetId,userId) 
    VALUES('${tweetId}','${userId}');
  UPDATE Tweet
    SET likeCount=likeCount + 1
    WHERE id is ${tweetId};`;
};

const getDecreaseLikesQuery = function(tweetId, userId) {
  return `BEGIN TRANSACTION;
  DELETE FROM Likes
    WHERE userId = '${userId}' AND tweetId='${tweetId}';
  UPDATE Tweet
    SET likeCount=likeCount - 1
    WHERE id is '${tweetId}';`;
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
  const followQuery = getFollowQuery(tweeterId, userId, '-');
  return (
    followQuery +
    `DELETE FROM Followers
              WHERE followerId = '${userId}' AND followingId = '${tweeterId}';`
  );
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

const createTweetView = (userId) => `WITH homeDetails as (
  SELECT DISTINCT(Tweet.id), Tweet.replyCount as replyCount,
  Tweet.likeCount as likeCount,
  Tweet.retweetCount as retweetCount,
  Tweet.userId as userId,
  Tweet._type as type,
  Tweet.content as content,
  Tweet.reference as reference,
  Tweet.timeStamp as timeStamp
   From Tweet
  LEFT JOIN Followers
  on Tweet.userId = Followers.followingId OR Tweet.userId = '${userId}'
  WHERE Followers.followerId = '${userId}' OR Tweet.userId = '${userId}'`;

const getAllTweetsQuery = function(userId, loggedInUser) {
  return `WITH tweets as (
          ${createTweetView(userId)}
      )
      SELECT *, homeDetails.id as id
       FROM homeDetails LEFT JOIN Tweeter
       ON homeDetails.userId = Tweeter.id
       WHERE homeDetails.type = 'tweet' OR homeDetails.type = 'retweet'
    ) ${getUserAction(loggedInUser)}`;
};

const getUpdateProfileQuery = function(userId, name, bio) {
  return `UPDATE Tweeter SET name='${name}', bio='${bio}' where id='${userId}'`;
};

const getFollowersQuery = function(userId) {
  return `SELECT * FROM 
    Followers LEFT JOIN Tweeter
    ON Tweeter.id = Followers.followerId
    WHERE Followers.followingId is '${userId}';`;
};

const getFollowingsQuery = function(userId) {
  return `SELECT * FROM 
    Followers LEFT JOIN Tweeter
    ON Tweeter.id = Followers.followingId
    WHERE Followers.followerId is '${userId}';`;
};

const getLikedTweetsQuery = function(userId, loggedInUser) {
  return `with Tweets as (WITH homeDetails as (
    SELECT tweet.userId, tweet.id, tweet.content, tweet.likeCount, 
    tweet._type, tweet.replyCount, tweet.reference, tweet.retweetCount
     From likes
    LEFT JOIN tweet
    on Tweet.id = likes.tweetId
    WHERE likes.userId = '${userId}')
  SELECT *, homeDetails.id as id
         FROM homeDetails LEFT JOIN Tweeter
         ON homeDetails.userId = Tweeter.id
      )${getUserAction(loggedInUser)}`;
};

const getRetweetedTweetsQuery = function(userId, loggedInUser) {
  return `with Tweets as (WITH homeDetails as (
    SELECT tweet.userId, tweet.id, tweet.content, tweet.likeCount, 
    tweet._type, tweet.replyCount, tweet.reference, tweet.retweetCount
     From Retweet
    LEFT JOIN tweet
    on Tweet.id = retweet.tweetId
    WHERE retweet.userId = '${userId}')
  SELECT *, homeDetails.id as id
         FROM homeDetails LEFT JOIN Tweeter
         ON homeDetails.userId = Tweeter.id
      )${getUserAction(loggedInUser)}`;
};

const getSpecificTweetQuery = function(tweetId, userId) {
  return `with tweets as (SELECT *, tweet.id as id from Tweet
  LEFT JOIN tweeter on tweet.userId = tweeter.id
  Where Tweet.id = ${tweetId})
  ${getUserAction(userId)}`;
};

const getLikedByQuery = function(tweetId) {
  return `SELECT * from Likes left join tweeter
  on Tweeter.id=Likes.userId
  where Likes.tweetId is '${tweetId}'`;
};

const getRetweetedByQuery = function(tweetId) {
  return `SELECT * from Retweet left join tweeter
  on Tweeter.id=Retweet.userId
  where Retweet.tweetId is '${tweetId}'`;
};

const getRepliedTweetQuery = function(userId, loggedInUser) {
  return `WITH tweets as ( WITH RepliedTweets as 
    (SELECT Tweet.id, Tweet.userId,
     Tweet.content, Tweet._type,
     Tweet.replyCount, Tweet.likeCount, Tweet.retweetCount
    FROM Tweet LEFT JOIN Tweet as Replies
  ON Replies.reference = Tweet.id 
  AND Tweet._type = 'tweet' AND Replies._type = 'reply'
  WHERE Replies.userId is '${userId}')
  SELECT *, RepliedTweets.id as id
    FROM RepliedTweets LEFT JOIN Tweeter
    ON RepliedTweets.userId = Tweeter.id )
    ${getUserAction(loggedInUser)}`;
};

const getReplyInsertionQuery = function(columns, values, tweetId) {
  return ` BEGIN TRANSACTION;
  ${getInsertionQuery('Tweet', columns, values)};
  UPDATE Tweet
  SET replyCount = replyCount + 1
  WHERE Tweet.id = '${tweetId}';`;
};

const getRepliesQuery = function(tweetId) {
  return `
  SELECT *, Tweet.id as id
    FROM Tweet LEFT JOIN Tweeter
    ON Tweet.userId = Tweeter.id
    WHERE Tweet._type is 'reply' AND Tweet.reference is '${tweetId}';`;
};

const getIncreaseRetweetsQuery = function(tweetId, userId) {
  return `BEGIN TRANSACTION;
  INSERT INTO Retweet (tweetId,userId) 
    VALUES('${tweetId}','${userId}');
  UPDATE Tweet
    SET retweetCount=retweetCount + 1
    WHERE id is ${tweetId};`;
};

const getDecreaseRetweetsQuery = function(tweetId, userId) {
  return `BEGIN TRANSACTION;
  DELETE FROM Retweet
    WHERE userId = '${userId}' AND tweetId='${tweetId}';
  UPDATE Tweet
    SET retweetCount=retweetCount - 1
    WHERE id is '${tweetId}';`;
};

module.exports = {
  getInsertionQuery,
  getDeleteQuery,
  getProfileSearchQuery,
  getSelectQuery,
  getTweetQuery,
  getIncreaseLikesQuery,
  getDecreaseLikesQuery,
  getAddFollowerQuery,
  getRemoveFollowerQuery,
  getProfileInfoQuery,
  getAllTweetsQuery,
  getUpdateProfileQuery,
  getFollowersQuery,
  getFollowingsQuery,
  getLikedTweetsQuery,
  getSpecificTweetQuery,
  getLikedByQuery,
  getRepliedTweetQuery,
  getReplyInsertionQuery,
  getRepliesQuery,
  getIncreaseRetweetsQuery,
  getDecreaseRetweetsQuery,
  getRetweetedTweetsQuery,
  getRetweetedByQuery
};
