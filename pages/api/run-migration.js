import pg from 'pg';

const { Pool } = pg;

export default async function handler(req, res) {
  // Security check - require secret parameter
  const { secret } = req.query;

  if (secret !== 'migrate123') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - invalid secret'
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Running newsletter table migration...');

    // Create newsletter_subscribers table
    const sql = `
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT NOW(),
        unsubscribed_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await pool.query(sql);

    // Verify table was created
    const checkTable = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name = 'newsletter_subscribers'
    `);

    if (checkTable.rows.length > 0) {
      console.log('✅ Newsletter table created successfully!');

      await pool.end();

      return res.status(200).json({
        success: true,
        message: 'Newsletter table created successfully!',
        table: 'newsletter_subscribers',
        columns: ['id', 'email', 'subscribed_at', 'unsubscribed_at', 'is_active', 'created_at']
      });
    } else {
      throw new Error('Table creation verification failed');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);

    await pool.end();

    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}
