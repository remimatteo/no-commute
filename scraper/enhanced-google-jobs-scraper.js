import pg from 'pg';
import fetch from 'node-fetch';
import { setTimeout } from 'timers/promises';

const { Pool } = pg;

class GoogleJobsScraper {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,  // Increased connection pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });

    // Configurable job search parameters
    this.jobQueries = [
      'remote entry level software engineer',
      'remote junior developer',
      'remote entry level tech jobs',
      'remote internship programming',
      'remote entry level web developer',
      // Added more specific queries
      'remote junior frontend developer',
      'remote junior backend developer',
      'remote junior fullstack developer',
      'remote entry level data science',
      'remote entry level cybersecurity'
    ];

    // Enhanced entry-level keywords
    this.entryLevelKeywords = [
      'entry level', 
      'junior', 
      'internship', 
      'new grad', 
      'early career', 
      'associate', 
      'starter', 
      'trainee'
    ];
  }

  /**
   * Generate a URL-friendly slug from job title and company name
   */
  generateJobSlug(title, company) {
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
   * Check if a job is entry-level
   */
  isEntryLevelJob(job) {
    const { title, description } = job;
    const lowercaseTitle = title.toLowerCase();
    const lowercaseDesc = description.toLowerCase();

    return this.entryLevelKeywords.some(keyword => 
      lowercaseTitle.includes(keyword) || 
      lowercaseDesc.includes(keyword)
    );
  }

  /**
   * Categorize job based on title and description
   */
  categorizeJob(job) {
    const { title, description } = job;
    const lowercaseTitle = title.toLowerCase();
    const lowercaseDesc = description.toLowerCase();

    const categories = {
      'Software Engineering': ['software', 'developer', 'engineer', 'programming'],
      'Web Development': ['web', 'frontend', 'backend', 'fullstack', 'html', 'css', 'javascript'],
      'Data': ['data', 'analyst', 'science', 'machine learning'],
      'Cybersecurity': ['security', 'cyber', 'infosec', 'network'],
      'Other': []
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => 
        lowercaseTitle.includes(keyword) || 
        lowercaseDesc.includes(keyword)
      )) {
        return category;
      }
    }

    return 'Other';
  }

  /**
   * Scrape Google Jobs with improved error handling and retry mechanism
   */
  async scrapeGoogleJobs() {
    console.log('🔍 Enhanced Google Jobs Scraper Starting...');

    const SERPAPI_KEY = process.env.SERPAPI_KEY;
    if (!SERPAPI_KEY) {
      console.error('❌ SERPAPI_KEY environment variable not set!');
      return { inserted: 0, skipped: 0, errors: 1 };
    }

    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const query of this.jobQueries) {
      try {
        const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=100`;
        
        // Implement exponential backoff for rate limiting
        const response = await this.fetchWithRetry(url, 3);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const jobs = data.jobs_results || [];

        console.log(`📦 Found ${jobs.length} jobs for query: ${query}`);

        const { 
          inserted, 
          skipped, 
          errors 
        } = await this.processJobs(jobs);

        totalInserted += inserted;
        totalSkipped += skipped;
        totalErrors += errors;

        // Add a small delay between queries to avoid rate limiting
        await setTimeout(2000);

      } catch (error) {
        console.error(`❌ Error processing query "${query}":`, error.message);
        totalErrors++;
      }
    }

    console.log(`✅ Scraping Complete: 
    - Inserted: ${totalInserted} 
    - Skipped: ${totalSkipped} 
    - Errors: ${totalErrors}`);

    return { 
      inserted: totalInserted, 
      skipped: totalSkipped, 
      errors: totalErrors 
    };
  }

  /**
   * Fetch with exponential backoff and retry
   */
  async fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url);
        
        if (response.ok) return response;
        
        if (response.status === 429) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Rate limited. Waiting ${waitTime/1000} seconds before retry...`);
          await setTimeout(waitTime);
        } else {
          throw new Error(`HTTP error: ${response.status}`);
        }
      } catch (error) {
        if (attempt === maxRetries) throw error;
        console.warn(`Attempt ${attempt} failed. Retrying...`);
      }
    }
  }

  /**
   * Process and insert jobs into database
   */
  async processJobs(jobs) {
    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const job of jobs) {
      try {
        // Skip if not an entry-level job
        if (!this.isEntryLevelJob(job)) {
          skipped++;
          continue;
        }

        const applyUrl = job.apply_options?.[0]?.link || job.share_link || '#';

        // Check for duplicates
        const existing = await this.pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [applyUrl]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        const title = job.title || 'Unknown Position';
        const company = job.company_name || 'Unknown Company';
        const slug = this.generateJobSlug(title, company);
        const location = job.location || 'Remote';
        const description = job.description || 'No description provided.';

        // Enhanced salary and job type extraction
        const salary = job.detected_extensions?.salary || 'Competitive';
        const jobType = job.detected_extensions?.schedule_type || 'Full-time';
        const category = this.categorizeJob(job);

        const postedDate = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        await this.pool.query(
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
            ['Remote', 'Google Jobs', 'Entry Level'],
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

    return { inserted, skipped, errors };
  }

  /**
   * Close database connection
   */
  async close() {
    await this.pool.end();
  }
}

async function main() {
  const scraper = new GoogleJobsScraper();
  
  try {
    console.log('🚀 Starting Enhanced Google Jobs Scraper...\n');
    console.log(`⏰ Run time: ${new Date().toLocaleString()}\n`);

    const result = await scraper.scrapeGoogleJobs();

    console.log('\n' + '='.repeat(60));
    console.log('📊 SCRAPING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ New jobs added: ${result.inserted}`);
    console.log(`⏭️  Duplicates skipped: ${result.skipped}`);
    console.log(`❌ Errors: ${result.errors}`);

    // Get total job count
    try {
      const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      const countResult = await pool.query('SELECT COUNT(*) as total FROM jobs');
      const totalJobs = countResult.rows[0].total;
      console.log(`\n📈 Total jobs in database: ${totalJobs}`);
      await pool.end();
    } catch (error) {
      console.error('Error getting total count:', error.message);
    }

    console.log('\n✨ Scraping complete!');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Scraper failed:', error);
  } finally {
    await scraper.close();
    process.exit(0);
  }
}

main().catch(console.error);
