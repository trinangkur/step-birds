PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS Tweeter;

CREATE TABLE Tweeter (
	UserId VARCHAR(20) PRIMARY KEY,
	UserName VARCHAR(30) NOT NULL,
	JoiningDate DATE(30) NOT NULL DEFAULT CURRENT_DATE,
	DOB DATE(30),
	Bio DATE(80),
	FollowersCount NUMERIC(5) NOT NULL DEFAULT 0,
	FollowingCount NUMERIC(5) NOT NULL DEFAULT 0
);

INSERT INTO Tweeter (UserID, UserName, JoiningDate, DOB, Bio, FollowersCount, FollowingCount) VALUES
('revathi','Revathi Dhurai', '07/07/2019', '21/12/2000', 'Enjoy Life', 0, 0),
('trinangkur','Trinangkur Chatterjee', '22/06/2017', '22/06/1998', 'Enjoy Food', 0, 0),
('rahit','Rahit Kar', '11/06/2020', '09/09/1998', 'Enjoy Netflix', 0, 0),
('vikram','Vikram Singh', '11/06/2018', '09/09/2000', 'My feets are not on ground', 0, 0);


SELECT * FROM Tweeter;

DROP TABLE IF EXISTS Tweet;

CREATE TABLE Tweet (
	TweetId INTEGER PRIMARY KEY AUTOINCREMENT,
	TweetType VARCHAR(8) NOT NULL,
	UserId VARCHAR(20) NOT NULL,
	Content VARCHAR(180) NOT NULL,
	Date DATE(30) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	LikeCount NUMERIC(5) NOT NULL DEFAULT 0,
	ReplyCount NUMERIC(5) NOT NULL DEFAULT 0,
	Reference NUMERIC(5),
	FOREIGN KEY(UserId) REFERENCES Tweeter(UserId),
	FOREIGN KEY(Reference) REFERENCES Tweet(TweetId)
);

INSERT INTO Tweet (TweetId, TweetType, UserId, Content, Reference) VALUES
(?,'tweet', 'revathi', 'Nice weather',?),
(?,'reply', 'trinangkur', 'Happy for you :)', 1),
(?,'reply', 'rahit', 'Enjoy More', 1),
(?,'tweet', 'rahit', 'Barcelona Jindabaad',?),
(?,'reply', 'revathi', 'who the hell is Barcelona?',3),
(?,'reply', 'trinangkur', 'I am amazed by the performance',3),
(?,'tweet', 'vikram', 'My laptop is broken :(',?),
(?,'reply', 'rahit', 'Do not worry brother',5);

INSERT INTO Tweet (TweetId, TweetType, UserId, Content, Reference) VALUES
(?,'reply', 'revathi', 'Nice weather',1);

SELECT * FROM Tweet;
SELECT * FROM Tweeter;

DROP TABLE IF EXISTS Followers;
PRAGMA foreign_keys = ON;

CREATE TABLE Followers (
	FollowerId VARCHAR(20) NOT NULL,
	FollowingId VARCHAR(20) NOT NULL,
	PRIMARY KEY (FollowerId, FollowingId),
	FOREIGN KEY (FollowerId) REFERENCES Tweeter(UserId),
	FOREIGN KEY (FollowingId) REFERENCES Tweeter(UserId)
);

BEGIN TRANSACTION;

INSERT INTO Followers (FollowerID, FollowingID) VALUES
('rahit', 'revathi');

UPDATE Tweeter
	SET FollowersCount = FollowersCount + 1
	WHERE UserId is 'revathi';

UPDATE Tweeter
	SET FollowingCount = FollowingCount + 1
	WHERE UserId is 'rahit';

COMMIT;

SELECT * FROM Followers;

BEGIN TRANSACTION;

INSERT INTO Followers (FollowerID, FollowingID) VALUES
('revathi', 'rahit');

UPDATE Tweeter
	SET FollowersCount = FollowersCount + 1
	WHERE UserId is 'rahit';

UPDATE Tweeter
	SET FollowingCount = FollowingCount + 1
	WHERE UserId is 'revathi';

COMMIT;

SELECT * FROM Followers;
SELECT * FROM Tweeter;

DROP TABLE IF EXISTS Likes;
CREATE TABLE Likes (
	TweetId NUMERIC(10) NOT NULL,
	UserId VARCHAR(20) NOT NULL,
	PRIMARY KEY (TweetId, UserId),
	FOREIGN KEY (UserId) REFERENCES Tweeter(UserId),
	FOREIGN KEY (TweetId) REFERENCES Tweet(TweetId)
);

BEGIN TRANSACTION;

INSERT INTO Likes (TweetId,UserId) 
	VALUES('1','rahit');

UPDATE Tweet
	SET LikeCount=LikeCount + 1
	WHERE TweetId is 1;

COMMIT;

SELECT * FROM Tweet;
SELECT * FROM Likes;

DROP TABLE IF EXISTS Hashes;
CREATE TABLE Hashes (
	TweetId NUMERIC(10) NOT NULL,
	Tag VARCHAR(30) NOT NULL,
	FOREIGN KEY (TweetId) REFERENCES Tweet(TweetId)
);

BEGIN TRANSACTION;

INSERT INTO Tweet(TweetId, TweetType, UserId, Content, Reference) VALUES
(?,'tweet', 'vikram', 'Nice weather',?)

CREATE TABLE Mentions (
	UserId VARCHAR(20) NOT NULL,
	TweetId NUMERIC(10) NOT NULL,
	FOREIGN KEY (UserId) REFERENCES Tweeter(UserId),
	FOREIGN KEY (TweetId) REFERENCES Tweet(TweetId)
);

CREATE TABLE Bookmarks (
	UserId VARCHAR(20) NOT NULL,
	TweetId NUMERIC(10) NOT NULL,
	PRIMARY KEY(UserId, TweetId),
	FOREIGN KEY (UserId) REFERENCES Tweeter(UserId),
	FOREIGN KEY (TweetId) REFERENCES Tweet(TweetId)
);

