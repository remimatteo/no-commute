const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addSourceColumn() {
  try {
    await pool.query(`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'RemoteOK';
    `);
    
    console.log('✅ Source column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSourceColumn();