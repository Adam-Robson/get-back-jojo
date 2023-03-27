const pool = require('./lib/utils/pool');
const setup = require('./data/setup');

setup(pool)
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err))
  .finally(() => process.exit());
