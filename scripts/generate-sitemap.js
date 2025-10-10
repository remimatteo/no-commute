import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function generateSitemap() {
  try {
    const baseUrl = 'https://no-commute-jobs.com';
    
    console.log('🔄 Connecting to database...');
    
    // Get all jobs from database
    const result = await pool.query(
      'SELECT id, updated_at FROM jobs ORDER BY updated_at DESC'
    );
    
    const jobs = result.rows;
    console.log(`✅ Found ${jobs.length} jobs in database`);
    
    // Start sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Homepage - highest priority
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += '    <changefreq>hourly</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';
    
    // Static pages
    const staticPages = [
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/post-job', priority: '0.9', changefreq: 'weekly' },
      { url: '/blog', priority: '0.7', changefreq: 'weekly' }
    ];
    
    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });
    
    // Job listings
    jobs.forEach(job => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/jobs/${job.id}</loc>\n`;
      sitemap += `    <lastmod>${new Date(job.updated_at).toISOString()}</lastmod>\n`;
      sitemap += '    <changefreq>daily</changefreq>\n';
      sitemap += '    <priority>0.6</priority>\n';
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    // Write sitemap to public folder
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemap);
    
    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`📍 Location: ${publicPath}`);
    console.log(`📊 Total URLs: ${jobs.length + staticPages.length + 1}`);
    console.log(`   - 1 Homepage`);
    console.log(`   - ${staticPages.length} Static pages`);
    console.log(`   - ${jobs.length} Job listings`);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    await pool.end();
    process.exit(1);
  }
}

generateSitemap();