import pg from 'pg';

const { Pool } = pg;

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.method === 'POST' ? req.body : req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Update subscriber to inactive
    const result = await pool.query(
      `UPDATE newsletter_subscribers
       SET is_active = false, unsubscribed_at = NOW()
       WHERE email = $1 AND is_active = true
       RETURNING email`,
      [email.toLowerCase()]
    );

    await pool.end();

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Email not found or already unsubscribed'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);

    try {
      await pool.end();
    } catch (e) {
      // Ignore pool close error
    }

    return res.status(500).json({
      error: 'Failed to unsubscribe. Please try again later.'
    });
  }
}
