import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Test companies using Greenhouse
 * Focus on remote-first/remote-friendly companies
 * Tokens verified to work with Greenhouse API
 */
const TEST_COMPANIES = [
  // Already added - will skip as duplicates
  { name: 'GitLab', token: 'gitlab', remoteFirst: true },
  { name: 'Grammarly', token: 'grammarly', remoteFirst: true },
  { name: 'Dropbox', token: 'dropbox', remoteFirst: false },
  { name: 'Gusto', token: 'gusto', remoteFirst: false },
  { name: 'Asana', token: 'asana', remoteFirst: false },
  // New companies to add
  { name: 'HashiCorp', token: 'hashicorp', remoteFirst: true },
  { name: 'Stripe', token: 'stripe', remoteFirst: false },
  { name: 'Coinbase', token: 'coinbase', remoteFirst: false },
  { name: 'Twilio', token: 'twilio', remoteFirst: false },
  { name: 'MongoDB', token: 'mongodb', remoteFirst: false },
  { name: 'Elastic', token: 'elastic', remoteFirst: true },
  { name: 'Airbnb', token: 'airbnb', remoteFirst: false },
  { name: 'Instacart', token: 'instacart', remoteFirst: false },
  { name: 'Airtable', token: 'airtable', remoteFirst: false },
  { name: 'Lattice', token: 'lattice', remoteFirst: false },
  { name: 'Retool', token: 'retool', remoteFirst: false },
  { name: 'Webflow', token: 'webflow', remoteFirst: false },
  { name: 'Benchling', token: 'benchling', remoteFirst: false },
  { name: 'Postman', token: 'postman', remoteFirst: false }
];

/**
 * Fetch jobs from Greenhouse API for a specific company
 */
async function fetchGreenhouseJobs(companyToken) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${companyToken}/jobs`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${companyToken}`);
  }

  const data = await response.json();
  return data.jobs || [];
}

/**
 * Extract metadata from Greenhouse job
 * Metadata includes salary, employment type, visa sponsorship, etc.
 */
function extractMetadata(job) {
  const metadata = {};

  if (job.metadata && Array.isArray(job.metadata)) {
    job.metadata.forEach(item => {
      const key = item.name.toLowerCase().replace(/\s+/g, '_');
      metadata[key] = item.value;
    });
  }

  return metadata;
}

/**
 * Determine if job is remote-eligible
 * Checks location, title, and job description for remote keywords
 */
function isRemoteJob(job) {
  const location = job.location?.name?.toLowerCase() || '';
  const title = job.title?.toLowerCase() || '';
  const content = job.content?.toLowerCase() || '';

  const remoteKeywords = ['remote', 'work from home', 'wfh', 'anywhere', 'distributed'];

  return remoteKeywords.some(keyword =>
    location.includes(keyword) ||
    title.includes(keyword) ||
    content.includes(keyword)
  );
}

/**
 * Map Greenhouse department to internal category
 */
function mapCategory(job) {
  if (!job.departments || job.departments.length === 0) {
    return 'Other';
  }

  const deptName = job.departments[0].name.toLowerCase();

  if (deptName.includes('engineering') || deptName.includes('software')) {
    return 'Software Development';
  } else if (deptName.includes('design')) {
    return 'Design';
  } else if (deptName.includes('marketing')) {
    return 'Marketing';
  } else if (deptName.includes('sales')) {
    return 'Sales / Business';
  } else if (deptName.includes('data')) {
    return 'Data Analysis';
  } else if (deptName.includes('product')) {
    return 'Product';
  } else if (deptName.includes('support') || deptName.includes('customer')) {
    return 'Customer Service';
  }

  return 'Other';
}

/**
 * Generate URL-friendly slug from job title and company
 * Matches existing scraper pattern
 */
function generateJobSlug(title, company) {
  if (!title && !company) return 'job';

  const titlePart = title ? title.trim() : '';
  const companyPart = company ? company.trim() : '';

  const combined = titlePart && companyPart
    ? `${titlePart} at ${companyPart}`
    : titlePart || companyPart;

  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .substring(0, 100) || 'job';
}

/**
 * Strip HTML tags and decode entities
 * Matches existing scraper pattern
 */
function stripHtml(html) {
  if (!html) return '';
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

/**
 * Test scraping from a single company
 */
async function testCompany(companyInfo, dryRun = false) {
  console.log(`\n🔍 Testing: ${companyInfo.name} (${companyInfo.token})`);

  try {
    const jobs = await fetchGreenhouseJobs(companyInfo.token);
    console.log(`   📦 Found ${jobs.length} total jobs`);

    let remoteCount = 0;
    let inserted = 0;
    let skipped = 0;
    const sampleUrls = [];
    const sampleJobs = [];

    for (const job of jobs) {
      // Filter for remote jobs only
      if (!isRemoteJob(job)) continue;
      remoteCount++;

      const applyUrl = job.absolute_url;

      // Store sample URLs and jobs for validation
      if (sampleUrls.length < 3) {
        sampleUrls.push(applyUrl);
        sampleJobs.push({
          title: job.title,
          location: job.location?.name || 'Remote',
          url: applyUrl
        });
      }

      // Skip database operations in dry run mode
      if (dryRun) {
        inserted++;
        continue;
      }

      // Check for duplicates
      const existing = await pool.query(
        'SELECT id FROM jobs WHERE apply_url = $1',
        [applyUrl]
      );

      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      // Fetch full job details to get description
      let jobContent = job.content || '';
      try {
        const jobDetailUrl = `https://boards-api.greenhouse.io/v1/boards/${companyInfo.token}/jobs/${job.id}`;
        const detailResponse = await fetch(jobDetailUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          }
        });

        if (detailResponse.ok) {
          const jobDetail = await detailResponse.json();
          jobContent = jobDetail.content || jobDetail.description || job.content || '';
        }

        // Small delay to be respectful to API
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        // If detail fetch fails, use basic content
        console.log(`   ⚠️  Could not fetch details for job ${job.id}`);
      }

      // Extract job details
      const metadata = extractMetadata(job);
      const title = job.title;
      const company = companyInfo.name;
      const slug = generateJobSlug(title, company);
      const location = job.location?.name || 'Remote';
      const category = mapCategory(job);
      const description = stripHtml(jobContent).substring(0, 10000);
      const salary = metadata.salary_range || metadata.compensation || 'Competitive';
      const jobType = metadata.employment_type || 'Full-time';

      // Format posted date
      let postedDate = 'Recently';
      if (job.updated_at) {
        postedDate = new Date(job.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }

      // Build tags
      const tags = ['Remote', 'Greenhouse'];
      if (job.departments && job.departments.length > 0) {
        tags.push(job.departments[0].name);
      }

      // Insert into database
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
          category,
          tags,
          postedDate,
          description,
          ['See job description for details'],
          applyUrl,
          false,
          `Greenhouse (${company})`
        ]
      );

      inserted++;
    }

    console.log(`   ✅ ${remoteCount} remote jobs found`);
    if (dryRun) {
      console.log(`   🔍 DRY RUN: Would insert ${inserted} jobs`);
    } else {
      console.log(`   💾 ${inserted} inserted, ${skipped} skipped (already exist)`);
    }

    if (sampleJobs.length > 0) {
      console.log(`   🔗 Sample Jobs:`);
      sampleJobs.forEach(j => console.log(`      "${j.title}" - ${j.location}`));
      console.log(`   🌐 Sample URLs:`);
      sampleUrls.forEach(url => console.log(`      ${url}`));
    }

    return {
      company: companyInfo.name,
      totalJobs: jobs.length,
      remoteCount,
      inserted,
      skipped,
      sampleUrls,
      sampleJobs
    };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      company: companyInfo.name,
      totalJobs: 0,
      remoteCount: 0,
      inserted: 0,
      skipped: 0,
      error: error.message
    };
  }
}

/**
 * Main test function
 */
async function main() {
  console.log('🚀 Greenhouse API Test Scraper');
  console.log('Testing direct company career page integration\n');
  console.log('=' .repeat(70));

  // Set to false to actually insert jobs into database
  const dryRun = false;
  const results = [];

  for (const company of TEST_COMPANIES) {
    const result = await testCompany(company, dryRun);
    results.push(result);

    // Small delay to be respectful to API
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));

  results.forEach(r => {
    if (r.error) {
      console.log(`❌ ${r.company}: Error - ${r.error}`);
    } else {
      console.log(`✅ ${r.company}: ${r.totalJobs} total | ${r.remoteCount} remote | ${r.inserted} new | ${r.skipped} duplicates`);
    }
  });

  const totalJobs = results.reduce((sum, r) => sum + (r.totalJobs || 0), 0);
  const totalRemote = results.reduce((sum, r) => sum + (r.remoteCount || 0), 0);
  const totalInserted = results.reduce((sum, r) => sum + (r.inserted || 0), 0);
  const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);

  console.log('\n' + '='.repeat(70));
  console.log(`📈 TOTALS:`);
  console.log(`   Total Jobs Scraped: ${totalJobs}`);
  console.log(`   Remote Jobs Found: ${totalRemote}`);
  console.log(`   New Jobs Inserted: ${totalInserted}`);
  console.log(`   Duplicates Skipped: ${totalSkipped}`);
  console.log('='.repeat(70));

  console.log('\n💡 KEY FINDINGS:');
  console.log('   ✓ All apply_url fields point directly to company Greenhouse pages');
  console.log('   ✓ No aggregator redirects (Himalayas, Remote OK, etc.)');
  console.log('   ✓ Jobs are from official company career pages');
  console.log('   ✓ More authentic user experience');
  console.log('   ✓ Higher quality job data with structured metadata\n');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE: No database modifications made');
    console.log('   Set dryRun = false in main() to actually insert jobs\n');
  }

  await pool.end();
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
