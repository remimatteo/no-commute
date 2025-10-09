const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkData() {
  try {
    // Check categories
    const categories = await pool.query(`
      SELECT DISTINCT category, COUNT(*) as count 
      FROM jobs 
      WHERE category IS NOT NULL 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    console.log('\n📊 CATEGORIES:');
    categories.rows.forEach(row => {
      console.log(`  ${row.category}: ${row.count} jobs`);
    });
    
    // Check job types
    const types = await pool.query(`
      SELECT DISTINCT type, COUNT(*) as count 
      FROM jobs 
      WHERE type IS NOT NULL 
      GROUP BY type 
      ORDER BY count DESC
    `);
    
    console.log('\n💼 JOB TYPES:');
    types.rows.forEach(row => {
      console.log(`  ${row.type}: ${row.count} jobs`);
    });
    
    // Check top locations
    const locations = await pool.query(`
      SELECT DISTINCT location, COUNT(*) as count 
      FROM jobs 
      WHERE location IS NOT NULL 
      GROUP BY location 
      ORDER BY count DESC 
      LIMIT 20
    `);
    
    console.log('\n🌍 TOP 20 LOCATIONS:');
    locations.rows.forEach(row => {
      console.log(`  ${row.location}: ${row.count} jobs`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();