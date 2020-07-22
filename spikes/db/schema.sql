DROP TABLE IF EXISTS Tweeter;
CREATE TABLE Tweeter (
	id VARCHAR(20) PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	joiningDate DATE NOT NULL DEFAULT CURRENT_DATE,
	dob DATE,
	bio VARCHAR(80),
	followersCount NUMERIC(5) NOT NULL DEFAULT 0,
	followingCount NUMERIC(5) NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS Tweet;
CREATE TABLE Tweet (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	_type VARCHAR(8) NOT NULL,
	userId VARCHAR(20) NOT NULL,
	content VARCHAR(180) NOT NULL,
	timeStamp DATE(30) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	likeCount NUMERIC(5) NOT NULL DEFAULT 0,
	replyCount NUMERIC(5) NOT NULL DEFAULT 0,
	reference NUMERIC(5),
	FOREIGN KEY(userId) REFERENCES Tweeter(id),
	FOREIGN KEY(reference) REFERENCES Tweet(id)
);

DROP TABLE IF EXISTS Followers;
CREATE TABLE Followers (
	followerId VARCHAR(20) NOT NULL,
	followingId VARCHAR(20) NOT NULL,
	PRIMARY KEY (followerId, followingId),
	FOREIGN KEY (followerId) REFERENCES Tweeter(id),
	FOREIGN KEY (followingId) REFERENCES Tweeter(id)
);

DROP TABLE IF EXISTS Likes;
CREATE TABLE Likes (
	tweetId NUMERIC(10) NOT NULL,
	userId VARCHAR(20) NOT NULL,
	PRIMARY KEY (tweetId, userId),
	FOREIGN KEY (userId) REFERENCES Tweeter(id),
	FOREIGN KEY (tweetId) REFERENCES Tweet(id)
);

DROP TABLE IF EXISTS Hashes;
CREATE TABLE Hashes (
	tweetId NUMERIC(10) NOT NULL,
	tag VARCHAR(30) NOT NULL,
	FOREIGN KEY (tweetId) REFERENCES Tweet(id)
);

DROP TABLE IF EXISTS Mentions;
CREATE TABLE Mentions (
	userId VARCHAR(20) NOT NULL,
	tweetId NUMERIC(10) NOT NULL,
	FOREIGN KEY (userId) REFERENCES Tweeter(id),
	FOREIGN KEY (tweetId) REFERENCES Tweet(id)
);

DROP TABLE IF EXISTS Bookmarks;
CREATE TABLE Bookmarks (
	userId VARCHAR(20) NOT NULL,
	tweetId NUMERIC(10) NOT NULL,
	PRIMARY KEY(userId, tweetId),
	FOREIGN KEY (userId) REFERENCES Tweeter(id),
	FOREIGN KEY (tweetId) REFERENCES Tweet(id)
);