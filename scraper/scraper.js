import pg from 'pg';
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

// Scrape RemoteOK
async function scrapeRemoteOK() {
  console.log('🔍 Fetching jobs from RemoteOK...');

  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jobs = data.slice(1); // First item is metadata

    console.log(`📦 Found ${jobs.length} jobs from RemoteOK`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        const applyUrl = job.url || `https://remoteok.com/l/${job.id}`;

        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [applyUrl]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        const title = job.position || 'Unknown Position';
        const company = job.company || 'Unknown Company';
        const slug = generateJobSlug(title, company);
        const location = job.location || 'Worldwide';
        const salary = job.salary_min && job.salary_max
          ? `$${job.salary_min}k - $${job.salary_max}k`
          : 'Competitive';
        const type = 'Full-time';
        const category = job.tags?.[0] || 'Other';
        const tags = job.tags?.slice(0, 5) || [];
        const description = job.description || 'No description provided.';
        const postedDate = job.date ? new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

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
            type,
            category,
            tags,
            postedDate,
            description,
            ['Remote work experience', 'Self-motivated', 'Good communication skills'],
            applyUrl,
            false,
            'RemoteOK'
          ]
        );

        inserted++;

        if (inserted % 50 === 0) {
          console.log(`   ⏳ Processed ${inserted + skipped}/${jobs.length} jobs...`);
        }
      } catch (err) {
        errors++;
        console.error(`   ✗ Error inserting job "${job.position}":`, err.message);
      }
    }

    console.log(`✅ RemoteOK: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'RemoteOK' };

  } catch (error) {
    console.error('❌ Error scraping RemoteOK:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'RemoteOK', error: error.message };
  }
}

// Scrape We Work Remotely
async function scrapeWeWorkRemotely() {
  console.log('🔍 Fetching jobs from We Work Remotely...');

  try {
    const response = await fetch('https://weworkremotely.com/remote-jobs.rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    // Simple RSS parsing (extract job data from XML)
    const jobMatches = text.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<description><!\[CDATA\[(.*?)\]\]><\/description>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/g);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    let count = 0;

    for (const match of jobMatches) {
      count++;
      try {
        const [_, fullTitle, link, description, pubDate] = match;

        // Parse title format: "Company Name: Job Title"
        const titleParts = fullTitle.split(':');
        const company = titleParts[0]?.trim() || 'Unknown Company';
        const title = titleParts[1]?.trim() || fullTitle;

        // Check for duplicates
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [link]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        const slug = generateJobSlug(title, company);
        const postedDate = new Date(pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        await pool.query(
          `INSERT INTO jobs
          (title, company, slug, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            title,
            company,
            slug,
            'Worldwide',
            'Competitive',
            'Full-time',
            'Other',
            ['Remote'],
            postedDate,
            description.substring(0, 500) + '...',
            ['Remote work experience', 'Self-motivated'],
            link,
            false,
            'We Work Remotely'
          ]
        );

        inserted++;
      } catch (err) {
        errors++;
        console.error(`   ✗ Error inserting WWR job:`, err.message);
      }
    }

    console.log(`📦 Found ${count} jobs from We Work Remotely`);
    console.log(`✅ We Work Remotely: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'We Work Remotely' };

  } catch (error) {
    console.error('❌ Error scraping We Work Remotely:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'We Work Remotely', error: error.message };
  }
}

// Scrape Remotive
async function scrapeRemotive() {
  console.log('🔍 Fetching jobs from Remotive...');

  try {
    const response = await fetch('https://remotive.com/api/remote-jobs', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jobs = data.jobs || [];

    console.log(`📦 Found ${jobs.length} jobs from Remotive`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [job.url]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        const title = job.title || 'Unknown Position';
        const company = job.company_name || 'Unknown Company';
        const slug = generateJobSlug(title, company);
        const postedDate = new Date(job.publication_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        await pool.query(
          `INSERT INTO jobs
          (title, company, slug, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            title,
            company,
            slug,
            job.candidate_required_location || 'Worldwide',
            job.salary || 'Competitive',
            job.job_type || 'Full-time',
            job.category || 'Other',
            job.tags || ['Remote'],
            postedDate,
            job.description || 'No description provided.',
            ['Remote work experience'],
            job.url,
            false,
            'Remotive'
          ]
        );

        inserted++;

        if (inserted % 50 === 0) {
          console.log(`   ⏳ Processed ${inserted + skipped}/${jobs.length} jobs...`);
        }
      } catch (err) {
        errors++;
        console.error(`   ✗ Error inserting Remotive job:`, err.message);
      }
    }

    console.log(`✅ Remotive: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'Remotive' };

  } catch (error) {
    console.error('❌ Error scraping Remotive:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'Remotive', error: error.message };
  }
}

/**
 * Clean up old jobs (older than 60 days)
 */
async function cleanupOldJobs() {
  console.log('🧹 Cleaning up old jobs...');

  try {
    // Delete jobs older than 60 days
    const result = await pool.query(`
      DELETE FROM jobs
      WHERE created_at < NOW() - INTERVAL '60 days'
      RETURNING id
    `);

    const deletedCount = result.rowCount;
    console.log(`✅ Removed ${deletedCount} old jobs (>60 days old)\n`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Error cleaning up old jobs:', error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting multi-source job scraper...\n');
  console.log(`⏰ Run time: ${new Date().toLocaleString()}\n`);

  // Clean up old jobs first
  const deletedCount = await cleanupOldJobs();

  // Run all scrapers
  const results = [];

  const remoteOKResult = await scrapeRemoteOK();
  results.push(remoteOKResult);
  console.log('');

  const wwrResult = await scrapeWeWorkRemotely();
  results.push(wwrResult);
  console.log('');

  const remotiveResult = await scrapeRemotive();
  results.push(remotiveResult);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SCRAPING SUMMARY');
  console.log('='.repeat(60));

  const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
  const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);

  console.log(`✅ Total new jobs added: ${totalInserted}`);
  console.log(`⏭️  Total duplicates skipped: ${totalSkipped}`);
  console.log(`❌ Total errors: ${totalErrors}`);
  console.log(`🧹 Old jobs removed: ${deletedCount}`);

  // Per-source breakdown
  console.log('\n📋 Per-Source Breakdown:');
  results.forEach(result => {
    console.log(`   ${result.source}: +${result.inserted} new, ${result.skipped} duplicates, ${result.errors} errors`);
  });

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