const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixColumnSizes() {
  try {
    await pool.query(`
      ALTER TABLE jobs 
      ALTER COLUMN title TYPE TEXT,
      ALTER COLUMN company TYPE TEXT,
      ALTER COLUMN location TYPE TEXT;
    `);
    
    console.log('✅ Column sizes updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixColumnSizes();