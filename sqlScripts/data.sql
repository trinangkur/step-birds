PRAGMA foreign_keys = ON;
INSERT INTO Tweeter (id, name, image_url, joiningDate, dob, bio, followersCount, followingCount) VALUES
('revathi','Revathi Dhurai', 'fakeUrl', '07/07/2019', '21/12/2000', 'Enjoy Life', 0, 0),
('trinangkur','Trinangkur Chatterjee','fakeUrl', '22/06/2017', '22/06/1998', 'Enjoy Food', 0, 0),
('rahit','Rahit Kar','fakeUrl', '11/06/2020', '09/09/1998', 'Enjoy Netflix', 0, 0),
('rahitkar','Rahit Kar','fakeUrl', '11/06/2020', '09/09/1998', 'Enjoy Netflix', 0, 0),
('vikram','Vikram Singh','fakeUrl', '11/06/2018', '09/09/2000', 'My feets are not on ground', 0, 0);

INSERT INTO Tweet (id, _type, userId, content, reference, timeStamp) VALUES
(?,'tweet', 'revathi', 'Nice weather',?, 'someDate'),
(?,'reply', 'trinangkur', 'Happy for you :)', 1, 'someDate'),
(?,'reply', 'rahit', 'Enjoy More', 1, 'someDate'),
(?,'tweet', 'rahit', 'Barcelona Jindabaad',?, 'someDate'),
(?,'reply', 'revathi', 'who the hell is Barcelona?',3, 'someDate'),
(?,'reply', 'trinangkur', 'I am amazed by the performance',3, 'someDate'),
(?,'tweet', 'vikram', 'My laptop is broken :(',?, 'someDate'),
(?,'reply', 'rahit', 'Do not worry brother',5, 'someDate');

INSERT INTO Tweet (id, _type, userId, content, reference) VALUES
(?,'reply', 'revathi', 'Nice weather',1);
