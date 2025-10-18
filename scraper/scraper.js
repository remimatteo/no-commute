import pg from 'pg';
import 'dotenv/config';

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
 * Parse RSS feed and extract job items
 */
function parseRSS(xmlText) {
  const jobs = [];

  // Match all <item> blocks
  const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const itemMatch of itemMatches) {
    const itemContent = itemMatch[1];

    // Extract fields
    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/);
    const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
    const categoryMatch = itemContent.match(/<category>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/);

    jobs.push({
      title: titleMatch ? titleMatch[1].trim() : '',
      link: linkMatch ? linkMatch[1].trim() : '',
      description: descMatch ? descMatch[1].trim() : '',
      pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
      category: categoryMatch ? categoryMatch[1].trim() : ''
    });
  }

  return jobs;
}

/**
 * Clean HTML tags from text
 */
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Scrape We Work Remotely RSS Feed
async function scrapeWeWorkRemotely() {
  console.log('🔍 Fetching jobs from We Work Remotely RSS...');

  try {
    const response = await fetch('https://weworkremotely.com/remote-jobs.rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const jobs = parseRSS(xmlText);

    console.log(`📦 Found ${jobs.length} jobs from We Work Remotely RSS`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        if (!job.link) {
          errors++;
          continue;
        }

        // Check for duplicates
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [job.link]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        // Parse title format: "Company: Job Title" or just use title
        let company = 'Unknown Company';
        let title = job.title;

        if (job.title.includes(':')) {
          const parts = job.title.split(':');
          company = parts[0].trim();
          title = parts.slice(1).join(':').trim();
        }

        const slug = generateJobSlug(title, company);
        const description = stripHtml(job.description).substring(0, 2000);
        const category = job.category || 'Other';

        let postedDate = 'Recently';
        if (job.pubDate) {
          try {
            postedDate = new Date(job.pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          } catch (e) {
            // Keep 'Recently' if date parsing fails
          }
        }

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
            category,
            ['Remote', category],
            postedDate,
            description || 'No description provided.',
            ['Remote work experience', 'Self-motivated'],
            job.link,
            false,
            'We Work Remotely'
          ]
        );

        inserted++;
      } catch (err) {
        errors++;
        console.error(`   ✗ Error inserting WWR job: ${err.message}`);
      }
    }

    console.log(`✅ We Work Remotely: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'We Work Remotely' };

  } catch (error) {
    console.error('❌ Error scraping We Work Remotely:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'We Work Remotely', error: error.message };
  }
}

// Scrape Remote.co RSS Feed
async function scrapeRemoteCo() {
  console.log('🔍 Fetching jobs from Remote.co RSS...');

  try {
    const response = await fetch('https://remote.co/remote-jobs/rss/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const jobs = parseRSS(xmlText);

    console.log(`📦 Found ${jobs.length} jobs from Remote.co RSS`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        if (!job.link) {
          errors++;
          continue;
        }

        // Check for duplicates
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [job.link]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        // Extract company from title or description
        let company = 'Unknown Company';
        let title = job.title;

        if (job.title.includes(' at ')) {
          const parts = job.title.split(' at ');
          title = parts[0].trim();
          company = parts[1].trim();
        } else if (job.title.includes(' - ')) {
          const parts = job.title.split(' - ');
          title = parts[0].trim();
          company = parts[1]?.trim() || 'Unknown Company';
        }

        const slug = generateJobSlug(title, company);
        const description = stripHtml(job.description).substring(0, 2000);
        const category = job.category || 'Other';

        let postedDate = 'Recently';
        if (job.pubDate) {
          try {
            postedDate = new Date(job.pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          } catch (e) {
            // Keep 'Recently' if date parsing fails
          }
        }

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
            category,
            ['Remote', category],
            postedDate,
            description || 'No description provided.',
            ['Remote work experience', 'Self-motivated'],
            job.link,
            false,
            'Remote.co'
          ]
        );

        inserted++;
      } catch (err) {
        errors++;
        console.error(`   ✗ Error inserting Remote.co job: ${err.message}`);
      }
    }

    console.log(`✅ Remote.co: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'Remote.co' };

  } catch (error) {
    console.error('❌ Error scraping Remote.co:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'Remote.co', error: error.message };
  }
}

// Scrape Remotive API
async function scrapeRemotive() {
  console.log('🔍 Fetching jobs from Remotive API...');

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

    console.log(`📦 Found ${jobs.length} jobs from Remotive API`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        if (!job.url) {
          errors++;
          continue;
        }

        // Check for duplicates
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
        const description = stripHtml(job.description || '').substring(0, 2000);
        const category = job.category || 'Other';
        const location = job.candidate_required_location || 'Worldwide';
        const salary = job.salary || 'Competitive';
        const jobType = job.job_type || 'full_time';
        const tags = job.tags || ['Remote'];

        let postedDate = 'Recently';
        if (job.publication_date) {
          try {
            postedDate = new Date(job.publication_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          } catch (e) {
            // Keep 'Recently' if date parsing fails
          }
        }

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
            jobType === 'full_time' ? 'Full-time' : 'Contract',
            category,
            Array.isArray(tags) ? tags : [category, 'Remote'],
            postedDate,
            description || 'No description provided.',
            ['Remote work experience'],
            job.url,
            false,
            'Remotive'
          ]
        );

        inserted++;

        if (inserted % 100 === 0) {
          console.log(`   ⏳ Processed ${inserted + skipped}/${jobs.length} jobs...`);
        }
      } catch (err) {
        errors++;
        if (errors <= 5) {
          console.error(`   ✗ Error inserting Remotive job "${job.title}": ${err.message}`);
        }
      }
    }

    console.log(`✅ Remotive: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'Remotive' };

  } catch (error) {
    console.error('❌ Error scraping Remotive:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'Remotive', error: error.message };
  }
}

// Scrape FlexJobs RSS Feed
async function scrapeFlexJobs() {
  console.log('🔍 Fetching jobs from FlexJobs RSS...');

  try {
    const response = await fetch('https://www.flexjobs.com/jobs/rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const jobs = parseRSS(xmlText);

    console.log(`📦 Found ${jobs.length} jobs from FlexJobs RSS`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        if (!job.link) {
          errors++;
          continue;
        }

        // Check for duplicates
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [job.link]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        // Parse title
        let company = 'Unknown Company';
        let title = job.title;

        if (job.title.includes(' - ')) {
          const parts = job.title.split(' - ');
          title = parts[0].trim();
          company = parts[1]?.trim() || 'Unknown Company';
        }

        const slug = generateJobSlug(title, company);
        const description = stripHtml(job.description).substring(0, 2000);
        const category = job.category || 'Other';

        let postedDate = 'Recently';
        if (job.pubDate) {
          try {
            postedDate = new Date(job.pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          } catch (e) {
            // Keep 'Recently' if date parsing fails
          }
        }

        await pool.query(
          `INSERT INTO jobs
          (title, company, slug, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            title,
            company,
            slug,
            'Remote',
            'Competitive',
            'Full-time',
            category,
            ['Remote', 'Flexible', category],
            postedDate,
            description || 'No description provided.',
            ['Remote work experience', 'Flexible schedule'],
            job.link,
            false,
            'FlexJobs'
          ]
        );

        inserted++;
      } catch (err) {
        errors++;
        console.error(`   ✗ Error inserting FlexJobs job: ${err.message}`);
      }
    }

    console.log(`✅ FlexJobs: Inserted ${inserted} new jobs, skipped ${skipped} duplicates, ${errors} errors`);
    return { inserted, skipped, errors, source: 'FlexJobs' };

  } catch (error) {
    console.error('❌ Error scraping FlexJobs:', error.message);
    return { inserted: 0, skipped: 0, errors: 1, source: 'FlexJobs', error: error.message };
  }
}

/**
 * Clean up old jobs (older than 30 days)
 */
async function cleanupOldJobs() {
  console.log('🧹 Cleaning up old jobs...');

  try {
    // Delete jobs older than 30 days
    const result = await pool.query(`
      DELETE FROM jobs
      WHERE created_at < NOW() - INTERVAL '30 days'
      RETURNING id
    `);

    const deletedCount = result.rowCount;
    console.log(`✅ Removed ${deletedCount} old jobs (>30 days old)\n`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Error cleaning up old jobs:', error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting RSS-based job scraper...\n');
  console.log(`⏰ Run time: ${new Date().toLocaleString()}\n`);

  // Clean up old jobs first
  const deletedCount = await cleanupOldJobs();

  // Run all scrapers
  const results = [];

  // Scrape Remotive first (main source with 1600+ jobs)
  const remotiveResult = await scrapeRemotive();
  results.push(remotiveResult);
  console.log('');

  // Scrape We Work Remotely (secondary source)
  const wwrResult = await scrapeWeWorkRemotely();
  results.push(wwrResult);
  console.log('');

  // Scrape Remote.co
  const remoteCoResult = await scrapeRemoteCo();
  results.push(remoteCoResult);
  console.log('');

  // Scrape FlexJobs
  const flexJobsResult = await scrapeFlexJobs();
  results.push(flexJobsResult);
  console.log('');

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
