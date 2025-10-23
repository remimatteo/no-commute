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

/**
 * Generate a sitemap file with URLs
 */
function generateSitemapXML(urls) {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${url.loc}</loc>\n`;
    sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${url.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';
  return sitemap;
}

/**
 * Generate a sitemap index file
 */
function generateSitemapIndex(sitemaps, baseUrl) {
  let index = '<?xml version="1.0" encoding="UTF-8"?>\n';
  index += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach(sitemap => {
    index += '  <sitemap>\n';
    index += `    <loc>${baseUrl}/${sitemap.file}</loc>\n`;
    index += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    index += '  </sitemap>\n';
  });

  index += '</sitemapindex>';
  return index;
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

    // Blog posts (from your actual blog)
    const blogPosts = [
      { slug: 'become-software-developer-no-degree', date: '2025-03-20' },
      { slug: 'breaking-into-ux-design', date: '2025-03-18' },
      { slug: 'applied-300-remote-jobs', date: '2025-03-17' },
      { slug: 'negotiating-remote-salary', date: '2025-03-15' },
      { slug: 'digital-nomad-reality-check', date: '2025-03-12' },
      { slug: 'remote-promotion-skills', date: '2025-03-10' }
    ];

    // ===== SITEMAP 1: Static pages (homepage, about, blog, etc.) =====
    const staticUrls = [
      {
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'hourly',
        priority: '1.0'
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/post-job`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        loc: `${baseUrl}/blog`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        loc: `${baseUrl}/privacy`,
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: '0.5'
      }
    ];

    // Add location pages
    const locations = ['usa', 'europe', 'canada', 'uk', 'australia', 'asia'];
    locations.forEach(location => {
      staticUrls.push({
        loc: `${baseUrl}/remote-jobs/${location}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.9'
      });
    });

    // Add category pages
    const categories = [
      'software-development',
      'design',
      'marketing',
      'sales',
      'customer-service',
      'product',
      'data-analysis',
      'devops',
      'finance',
      'hr',
      'writing',
      'project-management'
    ];
    categories.forEach(category => {
      staticUrls.push({
        loc: `${baseUrl}/remote-jobs/${category}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.9'
      });
    });

    const staticSitemap = generateSitemapXML(staticUrls);
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap-static.xml'), staticSitemap);

    // ===== SITEMAP 2: Blog posts =====
    const blogUrls = blogPosts.map(post => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: `${post.date}T00:00:00.000Z`,
      changefreq: 'monthly',
      priority: '0.7'
    }));

    const blogSitemap = generateSitemapXML(blogUrls);
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap-blog.xml'), blogSitemap);

    // ===== SITEMAP 3: Job listings (split if > 40,000) =====
    const jobUrls = jobs.map(job => {
      const slug = job.slug || generateJobSlug(job.title, job.company);
      const lastmod = job.updated_at || job.created_at || new Date();

      return {
        loc: `${baseUrl}/jobs/${job.id}/${slug}`,
        lastmod: new Date(lastmod).toISOString(),
        changefreq: 'daily',
        priority: '0.6'
      };
    });

    // Split jobs into chunks of 40,000 (Google recommends max 50,000 but we'll be conservative)
    const chunkSize = 40000;
    const jobChunks = [];
    for (let i = 0; i < jobUrls.length; i += chunkSize) {
      jobChunks.push(jobUrls.slice(i, i + chunkSize));
    }

    jobChunks.forEach((chunk, index) => {
      const jobSitemap = generateSitemapXML(chunk);
      const filename = jobChunks.length > 1 ? `sitemap-jobs-${index + 1}.xml` : 'sitemap-jobs.xml';
      fs.writeFileSync(path.join(__dirname, '..', 'public', filename), jobSitemap);
      console.log(`✅ Created ${filename} with ${chunk.length} URLs`);
    });

    // ===== SITEMAP INDEX: Main sitemap.xml =====
    const sitemaps = [
      { file: 'sitemap-static.xml' },
      { file: 'sitemap-blog.xml' }
    ];

    // Add job sitemaps
    jobChunks.forEach((chunk, index) => {
      const filename = jobChunks.length > 1 ? `sitemap-jobs-${index + 1}.xml` : 'sitemap-jobs.xml';
      sitemaps.push({ file: filename });
    });

    const sitemapIndex = generateSitemapIndex(sitemaps, baseUrl);
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemapIndex);

    console.log(`\n✅ Sitemaps generated successfully!`);
    console.log(`📍 Location: ${path.join(__dirname, '..', 'public')}`);
    console.log(`📊 Total sitemaps: ${sitemaps.length}`);
    console.log(`   - sitemap-static.xml: ${staticUrls.length} URLs`);
    console.log(`   - sitemap-blog.xml: ${blogUrls.length} URLs`);
    console.log(`   - sitemap-jobs*.xml: ${jobUrls.length} URLs (${jobChunks.length} file${jobChunks.length > 1 ? 's' : ''})`);
    console.log(`   - sitemap.xml: Main index file\n`);

    await pool.end();
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    await pool.end();
    process.exit(1);
  }
}

generateSitemap();
