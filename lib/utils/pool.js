const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE && { rejectUnauthorized: false },
});

// eslint-disable-next-line no-console
pool.on('connect', () => console.info('🐘 🐘 🐘 Postgres connected 🐘 🐘 🐘'));

module.exports = pool;
