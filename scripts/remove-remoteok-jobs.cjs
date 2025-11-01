const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
});

async function removeRemoteOKJobs() {
  console.log('🗑️  Removing Remote OK jobs from database...\n');

  try {
    // First, count how many Remote OK jobs exist
    const countResult = await pool.query(
      "SELECT COUNT(*) as count FROM jobs WHERE source = 'Remote OK'"
    );
    const count = parseInt(countResult.rows[0].count);

    console.log(`📊 Found ${count} Remote OK jobs in database`);

    if (count === 0) {
      console.log('✅ No Remote OK jobs to remove!');
      return;
    }

    // Delete Remote OK jobs
    const deleteResult = await pool.query(
      "DELETE FROM jobs WHERE source = 'Remote OK' RETURNING id"
    );

    const deletedCount = deleteResult.rowCount;
    console.log(`✅ Successfully deleted ${deletedCount} Remote OK jobs`);

    // Show updated total
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM jobs');
    const totalJobs = parseInt(totalResult.rows[0].count);
    console.log(`📈 Total jobs remaining in database: ${totalJobs}`);

  } catch (error) {
    console.error('❌ Error removing Remote OK jobs:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

removeRemoteOKJobs()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
