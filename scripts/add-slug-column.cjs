const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Generate a URL-friendly slug from job title and company name
 */
function generateJobSlug(title, company) {
  if (!title && !company) return 'job';

  const titlePart = title ? title.trim() : '';
  const companyPart = company ? company.trim() : '';

  const combined = titlePart && companyPart
    ? `${titlePart} at ${companyPart}`
    : titlePart || companyPart;

  const slug = combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .substring(0, 100);

  return slug || 'job';
}

async function main() {
  console.log('🚀 Starting slug column migration...\n');

  try {
    // Step 1: Add slug column if it doesn't exist
    console.log('📝 Adding slug column to jobs table...');
    await pool.query(`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS slug VARCHAR(200)
    `);
    console.log('✅ Slug column added successfully\n');

    // Step 2: Generate slugs for all existing jobs
    console.log('🔧 Generating slugs for existing jobs...');
    const result = await pool.query('SELECT id, title, company FROM jobs WHERE slug IS NULL');
    const jobs = result.rows;

    console.log(`📊 Found ${jobs.length} jobs without slugs\n`);

    let updated = 0;
    for (const job of jobs) {
      const slug = generateJobSlug(job.title, job.company);

      try {
        await pool.query(
          'UPDATE jobs SET slug = $1 WHERE id = $2',
          [slug, job.id]
        );
        updated++;

        if (updated % 100 === 0) {
          console.log(`   ✓ Updated ${updated}/${jobs.length} jobs...`);
        }
      } catch (err) {
        console.error(`   ✗ Error updating job ${job.id}:`, err.message);
      }
    }

    console.log(`\n✅ Successfully generated slugs for ${updated} jobs`);

    // Step 3: Create index on slug for better performance
    console.log('\n📊 Creating index on slug column...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug)
    `);
    console.log('✅ Index created successfully\n');

    console.log('🎉 Migration complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
