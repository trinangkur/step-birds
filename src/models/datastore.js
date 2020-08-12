const {
  getTweetQuery,
  getAllTweetsQuery,
  getSpecificTweetQuery,
  getProfileTweetsQuery,
  getSearchHashtagQuery
} = require('../queries/queryStringGenerator');

const filterBy = function(symbol, text) {
  const pattern = new RegExp(`${symbol}[A-Z]+`, 'ig');
  return text.match(pattern);
};

const getHashtagValues = function(hashTags, id) {
  return hashTags.map(tag => {
    return {tag: tag.slice(1), tweetId: id};
  });
};

const updateFollowCount = function(trx, tweeterId, userId, value) {
  return new Promise((res, rej) => {
    trx('Tweeter')
      .where('id', '=', tweeterId)
      .increment('followersCount', value)
      .then(() => {
        return trx('Tweeter')
          .where('id', '=', userId)
          .increment('followingCount', value);
      })
      .then(res())
      .catch(rej());
  });
};

class DataStore {
  constructor(newDb) {
    this.db = newDb;
  }

  addTweeter(details) {
    const {login, avatar_url, name} = details;
    return new Promise((res, rej) => {
      this.db('Tweeter')
        .insert({id: login, image_url: avatar_url, name: name})
        .then(() => res(true))
        .catch(err => {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res('already have an account');
          }
          rej(err);
        });
    });
  }

  postResponse(details) {
    const {userId, type, content, timeStamp, reference} = details;
    const hashTags = filterBy('#', content);
    return this.db.transaction(trx => {
      return trx('Tweet')
        .insert({
          userId,
          _type: type,
          content,
          timeStamp,
          reference
        })
        .then(ids => {
          if (hashTags) {
            const hashTagValues = getHashtagValues(hashTags, ids[0]);
            return trx('Hashes').insert(hashTagValues);
          }
        })
        .then(() => {
          if (type !== 'tweet') {
            return trx('Tweet')
              .where('id', '=', reference)
              .increment(`${type}Count`, 1);
          }
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }

  deleteTweet(tweetId, reference, type) {
    return this.db.transaction(trx => {
      return trx('Tweet')
        .where('id', '=', tweetId)
        .orWhere('reference', '=', tweetId)
        .del()
        .then(() => {
          return trx('Likes')
            .where('tweetId', '=', tweetId)
            .del();
        })
        .then(() => {
          return trx('Retweets')
            .where('tweetId', '=', tweetId)
            .del();
        })
        .then(() => {
          if (type !== 'tweet') {
            return trx('Tweet')
              .where('id', '=', reference)
              .decrement(`${type}Count`, 1);
          }
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }

  getUserProfiles(name) {
    return this.db
      .select('id', 'name', 'image_url')
      .from('Tweeter')
      .where('id', 'like', `%${name}`)
      .orWhere('name', 'like', `%${name}%`);
  }

  getUserInfo(userId) {
    return this.db
      .select()
      .from('Tweeter')
      .where('id', '=', userId);
  }

  toggleFollow(tweeterId, userId) {
    const fields = {followerId: userId, followingId: tweeterId};
    return new Promise((res, rej) => {
      this.db.transaction(trx => {
        return updateFollowCount(trx, tweeterId, userId, +1)
          .then(() => {
            return trx('Followers').insert(fields);
          })
          .then(() => {
            trx.commit;
            res(true);
          })
          .catch(() => {
            trx.rollback;
            this.db.transaction(trx => {
              return updateFollowCount(trx, tweeterId, userId, -2).then(() => {
                return trx('Followers')
                  .where(fields)
                  .del()
                  .then(() => {
                    trx.commit;
                    res(false);
                  });
              });
            });
          });
      });
    });
  }

  getProfileInfo(tweeterId, userId) {
    const cases = this.db.raw(` *,
    CASE
      WHEN Tweeter.id = '${userId}'
      THEN 'Edit Profile'
      WHEN Tweeter.id = Followers.followingId
        AND Followers.followerId = '${userId}'
      THEN 'Unfollow'
      ELSE 'Follow'
      end userOption`);
    return this.db('Tweeter')
      .select(cases)
      .leftJoin('Followers', 'Followers.followingId', 'Tweeter.id')
      .where({'Tweeter.id': tweeterId});
  }

  getParent(tweetId, userId) {
    const queryString = getSpecificTweetQuery(tweetId, userId);
    return this.db.raw(queryString);
  }

  async getAllTweets(userId) {
    const queryString = getAllTweetsQuery(userId);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  updateProfile(userId, name, bio) {
    return this.db('Tweeter')
      .update({name, bio})
      .where('id', '=', userId);
  }

  getFollow(listName, userId) {
    const column = listName === 'following' ? 'follower' : 'following';
    return this.db
      .select()
      .from('Followers')
      .leftJoin('Tweeter', 'Tweeter.id', `Followers.${listName}Id`)
      .where(`Followers.${column}Id`, '=', userId);
  }

  async getUserTweets(userId, loggedInUser) {
    const queryString = getTweetQuery(userId, loggedInUser);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  getActivitySpecificTweets(userId, activity, loggedInUser) {
    if (activity === 'tweets') {
      return this.getUserTweets(userId, loggedInUser);
    }

    const queryString = getProfileTweetsQuery(userId, activity, loggedInUser);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  async getTweetWithParentDetail(queryString, userId) {
    const tweets = await this.db.raw(queryString);
    const posts = [];

    for (const tweet of tweets) {
      const [reference] = await this.getParent(tweet.reference, userId);
      posts.push({tweet, reference});
    }
    return posts;
  }

  getTweet(tweetId, userId) {
    const queryString = getSpecificTweetQuery(tweetId, userId);
    return this.getTweetWithParentDetail(queryString, userId);
  }

  getActionBy(tweetId, table) {
    return this.db
      .select('*')
      .from(table)
      .leftJoin('Tweeter', 'Tweeter.id', `${table}.userId`)
      .where(`${table}.tweetId`, '=', tweetId);
  }

  getReplies(tweetId) {
    return this.db
      .select('*')
      .column({id: 'Tweet.id'})
      .from('Tweet')
      .leftJoin('Tweeter', 'Tweet.userId', 'Tweeter.id')
      .where({'Tweet._type': 'reply', 'Tweet.reference': tweetId});
  }

  updateAction(tweetId, userId, table, field) {
    return new Promise((res, rej) => {
      this.db.transaction(trx => {
        return trx(table)
          .insert({tweetId, userId})
          .then(() => {
            return trx('Tweet')
              .increment(field, 1)
              .where('id', '=', tweetId);
          })
          .then(() => {
            trx.commit;
            res(true);
          })
          .catch(() => {
            trx.rollback;
            this.db.transaction(trx => {
              return trx(table)
                .where({userId, tweetId})
                .del()
                .then(() => {
                  return trx('Tweet')
                    .decrement(field, 1)
                    .where('id', '=', tweetId)
                    .then(() => {
                      trx.commit;
                      res(false);
                    });
                });
            });
          });
      });
    });
  }

  searchHashtag(hashTag, loggedInUser) {
    const queryString = getSearchHashtagQuery(hashTag, loggedInUser);
    return this.getTweetWithParentDetail(queryString, loggedInUser);
  }

  getMatchingTags(tag) {
    const pattern = tag !== '*' ? `%${tag}%` : '%';
    return this.db('Hashes')
      .distinct('tag')
      .where('tag', 'like', pattern);
  }
}

module.exports = {DataStore};
