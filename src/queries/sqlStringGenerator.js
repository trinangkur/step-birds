const getInsertionSql = function (table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteSql = function (table, condition) {
  return `DELETE FROM ${table} WHERE ${condition}`;
};

const getSelectSql = function (table, { columns, condition }) {
  return `SELECT ${columns.join(',')} FROM ${table}
           WHERE ${condition}`;
};

const getProfileSearchSql = function (name) {
  return `SELECT id, name, image_url FROM Tweeter
  WHERE id like "%${name}%" OR name like "%${name}%"`;
};

const getTweetSql = function (userId) {
  return `select *, Tweet.id as id
    from Tweet
    left join Tweeter
      on Tweet.userId = Tweeter.id
      where userId is '${userId}';`;
};

module.exports = {
  getInsertionSql,
  getDeleteSql,
  getProfileSearchSql,
  getSelectSql,
  getTweetSql,
};
