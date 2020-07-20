CREATE TABLE `Tweeter` (
	`UserId` varchar(20) NOT NULL,
	`UserName` varchar(30) NOT NULL,
	`JoiningDate` DATE(30) NOT NULL DEFAULT 'date ('now')',
	`DOB` DATE(30),
	`Bio` DATE(80),
	`FollowersCount` INT(5) NOT NULL DEFAULT '0',
	`FollowingCount` INT(5) NOT NULL DEFAULT '0',
	PRIMARY KEY (`UserId`)
);

CREATE TABLE `Tweet` (
	`TweetId` INT(10) NOT NULL AUTO_INCREMENT,
	`Type` varchar(8) NOT NULL,
	`UserId` varchar(20) NOT NULL,
	`Content` varchar(180) NOT NULL,
	`Date` DATE(30) NOT NULL DEFAULT 'date ('now')',
	`LikeCount` INT(5) NOT NULL DEFAULT '0',
	`ReplyCount` INT(5) NOT NULL DEFAULT '0',
	`Reference` INT(10) DEFAULT '0',
	PRIMARY KEY (`TweetId`)
);

CREATE TABLE `Followers` (
	`FollowerId` varchar(20) NOT NULL,
	`FollowingId` varchar(20) NOT NULL
);

CREATE TABLE `Likes` (
	`TweetId` INT(10) NOT NULL,
	`UserId` varchar(20) NOT NULL
);

CREATE TABLE `Hashes` (
	`TweetId` INT(10) NOT NULL,
	`Tag` varchar(30) NOT NULL
);

CREATE TABLE `Mentions` (
	`UserId` varchar(20) NOT NULL,
	`TweetId` INT(10) NOT NULL
);

CREATE TABLE `Bookmarks` (
	`UserId` varchar(20) NOT NULL,
	`TweetId` INT(10) NOT NULL
);

ALTER TABLE `Tweet` ADD CONSTRAINT `Tweet_fk0` FOREIGN KEY (`UserId`) REFERENCES `Tweeter`(`UserId`);

ALTER TABLE `Followers` ADD CONSTRAINT `Followers_fk0` FOREIGN KEY (`FollowerId`) REFERENCES `Tweeter`(`UserId`);

ALTER TABLE `Followers` ADD CONSTRAINT `Followers_fk1` FOREIGN KEY (`FollowingId`) REFERENCES `Tweeter`(`UserId`);

ALTER TABLE `Likes` ADD CONSTRAINT `Likes_fk0` FOREIGN KEY (`TweetId`) REFERENCES `Tweet`(`TweetId`);

ALTER TABLE `Likes` ADD CONSTRAINT `Likes_fk1` FOREIGN KEY (`UserId`) REFERENCES `Tweeter`(`UserId`);

ALTER TABLE `Hashes` ADD CONSTRAINT `Hashes_fk0` FOREIGN KEY (`TweetId`) REFERENCES `Tweet`(`TweetId`);

ALTER TABLE `Mentions` ADD CONSTRAINT `Mentions_fk0` FOREIGN KEY (`UserId`) REFERENCES `Tweeter`(`UserId`);

ALTER TABLE `Mentions` ADD CONSTRAINT `Mentions_fk1` FOREIGN KEY (`TweetId`) REFERENCES `Tweet`(`TweetId`);

ALTER TABLE `Bookmarks` ADD CONSTRAINT `Bookmarks_fk0` FOREIGN KEY (`UserId`) REFERENCES `Tweeter`(`UserId`);

ALTER TABLE `Bookmarks` ADD CONSTRAINT `Bookmarks_fk1` FOREIGN KEY (`TweetId`) REFERENCES `Tweet`(`TweetId`);

