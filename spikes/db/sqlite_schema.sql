CREATE TABLE Tweeter (
	UserId varchar,
	UserName varchar,
	JoiningDate date,
	DOB date,
	Bio date,
	FollowersCount integer,
	FollowingCount integer
);

CREATE TABLE Tweet (
	TweetId integer PRIMARY KEY AUTOINCREMENT,
	Type varchar,
	UserId varchar,
	Content varchar,
	Date date,
	LikeCount integer,
	ReplyCount integer,
	Reference integer
);

CREATE TABLE Followers (
	FollowerId varchar,
	FollowingId varchar
);

CREATE TABLE Likes (
	TweetId integer,
	UserId varchar
);

CREATE TABLE Hashes (
	TweetId integer,
	Tag varchar
);

CREATE TABLE Mentions (
	UserId varchar,
	TweetId integer
);

CREATE TABLE Bookmarks (
	UserId varchar,
	TweetId integer
);

