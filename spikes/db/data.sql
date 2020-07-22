PRAGMA foreign_keys = ON;

INSERT INTO Tweeter (id, name, joiningDate, dob, bio, followersCount, followingCount) VALUES
('revathi','Revathi Dhurai', '07/07/2019', '21/12/2000', 'Enjoy Life', 0, 0),
('trinangkur','Trinangkur Chatterjee', '22/06/2017', '22/06/1998', 'Enjoy Food', 0, 0),
('rahit','Rahit Kar', '11/06/2020', '09/09/1998', 'Enjoy Netflix', 0, 0),
('vikram','Vikram Singh', '11/06/2018', '09/09/2000', 'My feets are not on ground', 0, 0);

SELECT * FROM Tweeter;

INSERT INTO Tweet (id, _type, userId, content, reference) VALUES
(?,'tweet', 'revathi', 'Nice weather',?),
(?,'reply', 'trinangkur', 'Happy for you :)', 1),
(?,'reply', 'rahit', 'Enjoy More', 1),
(?,'tweet', 'rahit', 'Barcelona Jindabaad',?),
(?,'reply', 'revathi', 'who the hell is Barcelona?',3),
(?,'reply', 'trinangkur', 'I am amazed by the performance',3),
(?,'tweet', 'vikram', 'My laptop is broken :(',?),
(?,'reply', 'rahit', 'Do not worry brother',5);

INSERT INTO Tweet (id, _type, userId, content, reference) VALUES
(?,'reply', 'revathi', 'Nice weather',1);

SELECT * FROM Tweet;
SELECT * FROM Tweeter;


BEGIN TRANSACTION;

INSERT INTO Followers (followerId, followingId) VALUES
('rahit', 'revathi');

UPDATE Tweeter
	SET followersCount =followersCount + 1
	WHERE id is 'revathi';

UPDATE Tweeter
	SET followingCount = followingCount + 1
	WHERE id is 'rahit';

COMMIT;

SELECT * FROM Followers;

BEGIN TRANSACTION;

INSERT INTO Followers (followerId, followingId) VALUES
('revathi', 'rahit');

UPDATE Tweeter
	SET followersCount = followersCount + 1
	WHERE id is 'rahit';

UPDATE Tweeter
	SET followingCount = followingCount + 1
	WHERE id is 'revathi';

COMMIT;

SELECT * FROM Followers;
SELECT * FROM Tweeter;



BEGIN TRANSACTION;

INSERT INTO Likes (tweetId,userId) 
	VALUES('1','rahit');

UPDATE Tweet
	SET likeCount=likeCount + 1
	WHERE id is 1;

COMMIT;

SELECT * FROM Tweet;
SELECT * FROM Likes;



-- BEGIN TRANSACTION;

-- INSERT INTO Tweet(tweetId, _type, userId, content, reference) VALUES
-- (?,'tweet', 'vikram', 'Nice weather',?)





