const getInsertionQuery = function (table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteQuery = function (table, condition) {
  return `DELETE FROM ${table} WHERE ${condition}`;
};

const getSelectQuery = function (table, { columns, condition }) {
  return `SELECT ${columns.join(',')} FROM ${table}
             WHERE ${condition}`;
};

const getProfileSearchQuery = function (name) {
  return `SELECT id, name, image_url FROM Tweeter
  WHERE id like "%${name}%" OR name like "%${name}%"`;
};

const getTweetQuery = function (userId, loggedInUser) {
  return `with tweets as
  (SELECT 
    t2.id as userId
    ,t2.name as name
    ,t1.id as id
    ,t1.content
    ,t1.timeStamp
    ,t1.likeCount
    ,t1.replyCount
    ,t2.image_url
    FROM Tweet t1 LEFT JOIN Tweeter t2 
    on t2.id is t1.userId 
    where t1.userId is '${userId}')
    SELECT *, tweets.userId as userId,
      CASE 
        WHEN tweets.id is Likes.tweetId
        and Likes.userId is '${loggedInUser}'
        then 'true'
        else 'false'
        end status
    FROM tweets LEFT JOIN Likes
    on Likes.userId='${loggedInUser}' 
    and Likes.tweetId=tweets.id;`;
};

const getIncreaseLikesQuery = function (tweetId, userId) {
  return `BEGIN TRANSACTION;
  INSERT INTO Likes (tweetId,userId) 
    VALUES('${tweetId}','${userId}');
  UPDATE Tweet
    SET likeCount=likeCount + 1
    WHERE id is ${tweetId};`;
};

const getDecreaseLikesQuery = function (tweetId, userId) {
  return `BEGIN TRANSACTION;
  DELETE FROM Likes
    WHERE userId = '${userId}' AND tweetId='${tweetId}';
  UPDATE Tweet
    SET likeCount=likeCount - 1
    WHERE id is '${tweetId}';`;
};

const getFollowQuery = function (tweeterId, userId, operator) {
  return `BEGIN TRANSACTION;
          UPDATE Tweeter
          SET followersCount=followersCount ${operator} 1
          WHERE id is '${tweeterId}';
          UPDATE Tweeter
          SET followingCount=followingCount ${operator} 1
            WHERE id is '${userId}'; `;
};

const getAddFollowerQuery = function (tweeterId, userId) {
  const followQuery = getFollowQuery(tweeterId, userId, '+');
  return (
    followQuery +
    `INSERT INTO Followers (followerId, followingId)
            VALUES('${userId}', '${tweeterId}');`
  );
};

const getRemoveFollowerQuery = function (tweeterId, userId) {
  const followQuery = getFollowQuery(tweeterId, userId, '-');
  return (
    followQuery +
    `DELETE FROM Followers
              WHERE followerId = '${userId}' AND followingId = '${tweeterId}';`
  );
};

const getProfileInfoQuery = function (tweeterId, userId) {
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
  Tweet.userId as userId,
  Tweet._type as type,
  Tweet.content as content,
  Tweet.reference as reference,
  Tweet.timeStamp as timeStamp
   From Tweet
  LEFT JOIN Followers
  on Tweet.userId = Followers.followingId OR Tweet.userId = '${userId}'
  WHERE Followers.followerId = '${userId}' OR Tweet.userId = '${userId}'`;

const getAllTweetsQuery = function (userId) {
  return `WITH tweets as (
          ${createTweetView(userId)}
      )
      SELECT *, homeDetails.id as id
       FROM homeDetails LEFT JOIN Tweeter
       ON homeDetails.userId = Tweeter.id
    ) SELECT *,
      tweets.userId as userId,
          CASE 
            WHEN tweets.id is Likes.tweetId
            and Likes.userId is '${userId}'
            then 'true'
            else 'false'
            end isLiked
        FROM tweets LEFT JOIN Likes
        on Likes.userId='${userId}' 
        and Likes.tweetId=tweets.id;`;
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
};
