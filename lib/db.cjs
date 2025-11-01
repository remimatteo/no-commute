/**
 * Database Connection Pool Singleton
 *
 * This file creates a SINGLE connection pool that is reused across all
 * database queries. This prevents connection pool exhaustion in serverless
 * environments like Vercel/Render.
 *
 * BEFORE: Each file created its own pool → 10+ pools → connection exhaustion
 * AFTER: One singleton pool shared by all files → stable connections
 */

const { Pool } = require('pg');

let pool = null;

/**
 * Get or create the database connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('render.com')
        ? { rejectUnauthorized: false }
        : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return error after 2 seconds if can't connect
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
      process.exit(-1);
    });

    console.log('📊 Database connection pool created');
  }

  return pool;
}

/**
 * Close the connection pool (use sparingly, mainly for testing)
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('📊 Database connection pool closed');
  }
}

module.exports = { getPool, closePool };
exports.default = getPool;
