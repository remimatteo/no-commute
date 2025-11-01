const { getPool } = require('../../../lib/db');

export default async function handler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Job ID is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job', message: error.message });
  }
}
