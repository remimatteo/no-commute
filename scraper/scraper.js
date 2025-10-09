import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Scrape RemoteOK
async function scrapeRemoteOK() {
  console.log('🔍 Fetching jobs from RemoteOK...');
  
  try {
    const response = await fetch('https://remoteok.com/api');
    const data = await response.json();
    const jobs = data.slice(1); // First item is metadata
    
    console.log(`📦 Found ${jobs.length} jobs from RemoteOK`);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const job of jobs) {
      try {
        const existing = await pool.query(
          'SELECT id FROM jobs WHERE apply_url = $1',
          [job.url || `https://remoteok.com/l/${job.id}`]
        );
        
        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }
        
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
        
        await pool.query(
          `INSERT INTO jobs 
          (title, company, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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
            ['Remote work experience', 'Self-motivated', 'Good communication skills'],
            applyUrl,
            false,
            'RemoteOK'
          ]
        );
        
        inserted++;
      } catch (err) {
        console.error(`Error inserting job ${job.position}:`, err.message);
      }
    }
    
    console.log(`✅ RemoteOK: Inserted ${inserted} new jobs, skipped ${skipped} duplicates`);
    
  } catch (error) {
    console.error('❌ Error scraping RemoteOK:', error);
  }
}

// Scrape We Work Remotely
async function scrapeWeWorkRemotely() {
  console.log('🔍 Fetching jobs from We Work Remotely...');
  
  try {
    const response = await fetch('https://weworkremotely.com/remote-jobs.rss');
    const text = await response.text();
    
    // Simple RSS parsing (extract job data from XML)
    const jobMatches = text.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<description><!\[CDATA\[(.*?)\]\]><\/description>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/g);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const match of jobMatches) {
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
        
        const postedDate = new Date(pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        await pool.query(
          `INSERT INTO jobs 
          (title, company, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            title,
            company,
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
        console.error(`Error inserting WWR job:`, err.message);
      }
    }
    
    console.log(`✅ We Work Remotely: Inserted ${inserted} new jobs, skipped ${skipped} duplicates`);
    
  } catch (error) {
    console.error('❌ Error scraping We Work Remotely:', error);
  }
}

// Scrape Remotive
async function scrapeRemotive() {
  console.log('🔍 Fetching jobs from Remotive...');
  
  try {
    const response = await fetch('https://remotive.com/api/remote-jobs');
    const data = await response.json();
    const jobs = data.jobs || [];
    
    console.log(`📦 Found ${jobs.length} jobs from Remotive`);
    
    let inserted = 0;
    let skipped = 0;
    
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
        
        const postedDate = new Date(job.publication_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        await pool.query(
          `INSERT INTO jobs 
          (title, company, location, salary, type, category, tags, posted_date, description, requirements, apply_url, featured, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            job.title,
            job.company_name,
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
      } catch (err) {
        console.error(`Error inserting Remotive job:`, err.message);
      }
    }
    
    console.log(`✅ Remotive: Inserted ${inserted} new jobs, skipped ${skipped} duplicates`);
    
  } catch (error) {
    console.error('❌ Error scraping Remotive:', error);
  }
}

async function main() {
  console.log('🚀 Starting multi-source job scraper...\n');
  
  await scrapeRemoteOK();
  console.log('');
  await scrapeWeWorkRemotely();
  console.log('');
  await scrapeRemotive();
  
  console.log('\n✨ Scraping complete!');
  await pool.end();
  process.exit(0);
}

main();