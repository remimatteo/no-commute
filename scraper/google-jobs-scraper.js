import pg from 'pg';
import fetch from 'node-fetch';
const { Pool } = pg;

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

/**
 * Scrape Google Jobs via SerpAPI
 * You need to sign up for SerpAPI and get an API key: https://serpapi.com/
 * Free tier: 100 searches/month
 */
async function scrapeGoogleJobs() {
  console.log('🔍 Fetching remote jobs from Google Jobs...');

  const SERPAPI_KEY = process.env.SERPAPI_KEY;

  if (!SERPAPI_KEY) {
    console.error('❌ SERPAPI_KEY environment variable not set!');
    console.log('   Sign up at https://serpapi.com/ and add your API key to .env.local');
    return { inserted: 0, skipped: 0, errors: 1 };
  }

  try {
    // Search for remote jobs
const entryLevelQueries = [
  'remote entry level software engineer',
  'remote junior developer',
  'remote entry level tech jobs',
  'remote internship programming',
  'remote entry level web developer'
];

// Randomly select a query to add variety
const selectedQuery = entryLevelQueries[Math.floor(Math.random() * entryLevelQueries.length)];
const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(selectedQuery)}&api_key=${SERPAPI_KEY}&num=100`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jobs = data.jobs_results || [];

    console.log(`📦 Found ${jobs.length} jobs from Google Jobs`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        const applyUrl = job.apply_options?.[0]?.link || job.share_link || '#';

        // Check for duplicates
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [applyUrl]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        const title = job.title || 'Unknown Position';
        const company = job.company_name || 'Unknown Company';
        const slug = generateJobSlug(title, company);
        const location = job.location || 'Remote';
        const description = job.description || 'No description provided.';

        // Extract salary if available
        let salary = 'Competitive';
        if (job.detected_extensions?.salary) {
          salary = job.detected_extensions.salary;
        }

        // Extract job type
let jobType = 'Full-time';
        if (job.detected_extensions?.schedule_type) {
          jobType = job.detected_extensions.schedule_type;
        }

        // Additional filtering for entry-level jobs
        const isEntryLevel = 
          title.toLowerCase().includes('entry') || 
          title.toLowerCase().includes('junior') || 
          title.toLowerCase().includes('internship') ||
          description.toLowerCase().includes('entry level') ||
          description.toLowerCase().includes('new grad');

        // Skip if not entry-level
        if (!isEntryLevel) {
          skipped++;
          continue;
        }

        const postedDate = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        await pool.query(
          `INSERT INTO jobs
          (title, company, slug, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            title,
            company,
            slug,
            location,
            salary,
            jobType,
            'Other', // You can improve category detection
            ['Remote', 'Google Jobs'],
            postedDate,
            description,
            ['See job description for details'],
            applyUrl,
            false,
            'Google Jobs'
          ]
        );

        inserted++;

        if (inserted % 20 === 0) {
          console.log(`   ⏳ Processed ${inserted + skipped}/${jobs.length} jobs...`);
        }
      } catch (err) {
        errors++;
        console.error(`   ✗ Error inserting job "${job.title}":`, err.message);
      }
    }

    console.log(`✅ Google Jobs: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'Google Jobs' };

  } catch (error) {
    console.error('❌ Error scraping Google Jobs:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'Google Jobs', error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting Google Jobs scraper...\n');
  console.log(`⏰ Run time: ${new Date().toLocaleString()}\n`);

  const result = await scrapeGoogleJobs();

  console.log('\n' + '='.repeat(60));
  console.log('📊 SCRAPING SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ New jobs added: ${result.inserted}`);
  console.log(`⏭️  Duplicates skipped: ${result.skipped}`);
  console.log(`❌ Errors: ${result.errors}`);

  // Get total job count
  try {
    const countResult = await pool.query('SELECT COUNT(*) as total FROM jobs');
    const totalJobs = countResult.rows[0].total;
    console.log(`\n📈 Total jobs in database: ${totalJobs}`);
  } catch (error) {
    console.error('Error getting total count:', error.message);
  }

  console.log('\n✨ Scraping complete!');
  console.log('='.repeat(60) + '\n');

  await pool.end();
  process.exit(0);
}

main();
