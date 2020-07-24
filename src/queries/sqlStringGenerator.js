const getInsertionSql = function(table, columns, values) {
  return `INSERT INTO ${table} (${columns})
                  VALUES (${values})`;
};

const getDeleteSql = function(table, condition) {
  return `DELETE FROM ${table} WHERE ${condition}`;
};

module.exports = {getInsertionSql, getDeleteSql};
