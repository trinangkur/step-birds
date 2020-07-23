const getInsertionSql = function(table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getSelectSql = function(table, {columns, where, groupBy, orderBy}) {
  let query = `SELECT ${columns.join(',')} FROM ${table}`;
  query = where ? query + ` WHERE ${where}` : query;
  query = groupBy ? query + ` GROUP BY ${groupBy}` : query;
  query = orderBy ? query + ` ORDER BY ${orderBy}` : query;
  return query;
};

const enableForeignKeySql = function() {
  return 'PRAGMA foreign_keys = ON;';
};

module.exports = {getInsertionSql, getSelectSql, enableForeignKeySql};
