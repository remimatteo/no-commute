import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function scrapeRemoteOK() {
  console.log('🔍 Fetching jobs from RemoteOK...');
  
  try {
    const response = await fetch('https://remoteok.com/api');
    const data = await response.json();
    
    // RemoteOK returns an array where first item is metadata, rest are jobs
    const jobs = data.slice(1);
    
    console.log(`📦 Found ${jobs.length} jobs from RemoteOK`);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const job of jobs) {
      try {
        // Check if job already exists (by apply_url to avoid duplicates)
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [job.url || `https://remoteok.com/l/${job.id}`]
        );
        
        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }
        
        // Extract relevant data
        const title = job.position || 'Unknown Position';
        const company = job.company || 'Unknown Company';
        const location = job.location || 'Worldwide';
        const salary = job.salary_min && job.salary_max 
          ? `$${job.salary_min}k - $${job.salary_max}k`
          : 'Competitive';
        const type = 'Full-time';
        const category = job.tags?.[0] || 'Other';
        const tags = job.tags?.slice(0, 5) || [];
        const description = job.description || 'No description provided.';
        const applyUrl = job.url || `https://remoteok.com/l/${job.id}`;
        const postedDate = job.date ? new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';
        
        // Insert into database
        await pool.query(
          `INSERT INTO jobs 
          (title, company, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            title,
            company,
            location,
            salary,
            type,
            category,
            tags,
            postedDate,
            description,
            ['Remote work experience', 'Self-motivated', 'Good communication skills'], // Default requirements
            applyUrl,
            false // Not featured by default
          ]
        );
        
        inserted++;
      } catch (err) {
        console.error(`Error inserting job ${job.position}:`, err.message);
      }
    }
    
    console.log(`✅ Inserted ${inserted} new jobs`);
    console.log(`⏭️  Skipped ${skipped} duplicate jobs`);
    
  } catch (error) {
    console.error('❌ Error scraping RemoteOK:', error);
  }
}

async function main() {
  console.log('🚀 Starting job scraper...\n');
  
  await scrapeRemoteOK();
  
  console.log('\n✨ Scraping complete!');
  await pool.end();
  process.exit(0);
}

main();