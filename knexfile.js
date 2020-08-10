module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: 'db/spike.db'
    },
    useNullAsDefault: true
  },
  seeds: {
    directory: './seeds/tweeter_data.js'
  }
};
