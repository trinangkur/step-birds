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

const getSpecificTweetQuery = function(tweetId, userId) {
  const t1 = 'Tweets';
  const t2 = 'Tweeter';
  const condition = `ON Tweeter.id is ${t1}.userId
      WHERE ${t1}.id IS ${tweetId}`;
  return `WITH ${t1} AS
          (${getUserAction(userId, 'Tweet')})
          ${createUserProjection(condition, t1, t2)}`;
};

module.exports = {
  getTweetQuery,
  getAllTweetsQuery,
  getSpecificTweetQuery,
  getProfileTweetsQuery,
  getSearchHashtagQuery
};
