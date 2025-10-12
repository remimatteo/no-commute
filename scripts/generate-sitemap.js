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

async function generateSitemap() {
  try {
    const baseUrl = 'https://no-commute-jobs.com';

    console.log('🔄 Connecting to database...');

    // Get all jobs from database with slug information
    const result = await pool.query(
      'SELECT id, title, company, slug, updated_at, created_at FROM jobs ORDER BY updated_at DESC'
    );

    const jobs = result.rows;
    console.log(`✅ Found ${jobs.length} jobs in database`);

    // Blog posts
    const blogPosts = [
      { slug: 'become-software-developer-no-degree', date: '2025-03-20' },
      { slug: 'breaking-into-ux-design', date: '2025-03-18' },
      { slug: 'applied-300-remote-jobs', date: '2025-03-17' },
      { slug: 'remote-work-revolution', date: '2025-03-15' },
      { slug: 'remote-jobs-100k-plus', date: '2025-03-14' },
      { slug: 'resume-rejected-6-seconds', date: '2025-03-13' },
      { slug: 'barista-to-product-manager', date: '2025-03-12' },
      { slug: 'remote-interview-mistakes', date: '2025-03-11' },
      { slug: 'first-data-analyst-job-no-experience', date: '2025-03-10' },
      { slug: 'quit-120k-job-go-remote', date: '2025-03-09' },
      { slug: 'remote-work-skills-employers-want', date: '2025-03-08' },
      { slug: 'top-remote-job-boards', date: '2025-03-10' },
      { slug: 'work-from-home-productivity', date: '2025-03-05' },
      { slug: 'remote-work-salary-guide', date: '2025-02-28' }
    ];

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
      sitemap += `    <priority>${page.priority}</priority>\n';
      sitemap += '  </url>\n';
    });

    // Blog posts
    blogPosts.forEach(post => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      sitemap += `    <lastmod>${post.date}T00:00:00.000Z</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.6</priority>\n';
      sitemap += '  </url>\n';
    });

    // Job listings with proper slugs
    jobs.forEach(job => {
      // Use existing slug or generate one
      const slug = job.slug || generateJobSlug(job.title, job.company);
      const lastmod = job.updated_at || job.created_at || new Date();

      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/jobs/${job.id}/${slug}</loc>\n`;
      sitemap += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
      sitemap += '    <changefreq>daily</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    // Write sitemap to public folder
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemap);

    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`📍 Location: ${publicPath}`);
    console.log(`📊 Total URLs: ${jobs.length + staticPages.length + blogPosts.length + 1}`);
    console.log(`   - 1 Homepage`);
    console.log(`   - ${staticPages.length} Static pages`);
    console.log(`   - ${blogPosts.length} Blog posts`);
    console.log(`   - ${jobs.length} Job listings`);

    await pool.end();
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    await pool.end();
    process.exit(1);
  }
}

generateSitemap();