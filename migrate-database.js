import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  console.log('🔄 Starting database migration...\n');

  try {
    // Add status column
    console.log('Adding status column...');
    await pool.query(`
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'
    `);
    console.log('✅ Status column added\n');

    // Add submitter_email column
    console.log('Adding submitter_email column...');
    await pool.query(`
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS submitter_email VARCHAR(255)
    `);
    console.log('✅ Submitter_email column added\n');

    // Add verification_token column
    console.log('Adding verification_token column...');
    await pool.query(`
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255)
    `);
    console.log('✅ Verification_token column added\n');

    // Add verified_at column
    console.log('Adding verified_at column...');
    await pool.query(`
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP
    `);
    console.log('✅ Verified_at column added\n');

    // Update existing jobs to have active status
    console.log('Updating existing jobs to active status...');
    const updateResult = await pool.query(`
      UPDATE jobs SET status = 'active' WHERE status IS NULL
    `);
    console.log(`✅ Updated ${updateResult.rowCount} jobs to active status\n`);

    // Create indexes
    console.log('Creating indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_verification_token ON jobs(verification_token)
    `);
    console.log('✅ Indexes created\n');

    console.log('🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update ADMIN_EMAIL in .env.local with your email address');
    console.log('2. Restart your dev server');
    console.log('3. Test job posting to see verification system in action\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

migrate();
