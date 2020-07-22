const { env } = process;

const getDB = () => {
  return env.STEP_BIRDS_DATABASE;
};

module.exports = { getDB };
