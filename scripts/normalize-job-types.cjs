const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function normalizeJobTypes() {
  try {
    // Normalize all job types
    await pool.query(`
      UPDATE jobs SET type = 'Full-time' WHERE type = 'full_time';
      UPDATE jobs SET type = 'Part-time' WHERE type = 'part_time';
      UPDATE jobs SET type = 'Contract' WHERE type = 'contract';
      UPDATE jobs SET type = 'Freelance' WHERE type = 'freelance';
      UPDATE jobs SET type = 'Internship' WHERE type = 'internship';
    `);
    
    console.log('✅ Job types normalized!');
    
    // Check results
    const result = await pool.query(`
      SELECT type, COUNT(*) as count 
      FROM jobs 
      GROUP BY type 
      ORDER BY count DESC
    `);
    
    console.log('\n📊 Updated job types:');
    result.rows.forEach(row => {
      console.log(`  ${row.type}: ${row.count} jobs`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

normalizeJobTypes();