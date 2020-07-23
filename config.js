const {env} = process;

const getDB = () => {
  return env.STEP_BIRDS_DATABASE || 'db/step-birds.db';
};

module.exports = {getDB};
