const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkSources() {
  try {
    const result = await pool.query(`
      SELECT source, COUNT(*) as count 
      FROM jobs 
      GROUP BY source
    `);
    
    console.log('Job sources in database:');
    result.rows.forEach(row => {
      console.log(`  ${row.source}: ${row.count} jobs`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSources();