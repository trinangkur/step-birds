const { env } = process;

const getDB = () => {
  return env.DATABASE;
};

module.exports = { getDB };