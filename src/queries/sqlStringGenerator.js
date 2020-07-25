const getInsertionSql = function(table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteSql = function(table, condition) {
  return `DELETE FROM ${table} WHERE ${condition}`;
};

const getSelectSql = function(table, {columns, condition}) {
  let sql = `SELECT ${columns.join(',')} FROM ${table}`;
  sql += condition ? ` WHERE ${condition}` : '';
  return sql;
};

module.exports = {getInsertionSql, getDeleteSql, getSelectSql};
