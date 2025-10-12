const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  try {
    // Fetch all jobs, sorted by featured/sponsored first, then by date
    // Featured jobs (paid posts that are approved) appear at the top
    const result = await pool.query(`
      SELECT * FROM jobs
      ORDER BY
        COALESCE(featured, false) DESC,
        created_at DESC
      LIMIT 2000
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs', message: error.message });
  }
}