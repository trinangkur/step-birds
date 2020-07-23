const getInsertionSql = function(table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getSelectSql = function(table, {columns, where}) {
  let query = `SELECT ${columns.join(',')} FROM ${table}`;
  query = where ? query + ` WHERE ${where}` : query;
  return query;
};

const getDeleteSql = function(table, condition) {
  return `DELETE FROM ${table} WHERE ${condition}`;
};

module.exports = {getInsertionSql, getSelectSql, getDeleteSql};
