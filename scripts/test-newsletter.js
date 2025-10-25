import { Resend } from 'resend';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function sendTestNewsletter() {
  try {
    console.log('📧 Sending TEST newsletter...\n');

    // Ask for test email
    const testEmail = process.argv[2];
    if (!testEmail) {
      console.error('❌ Please provide your email as an argument:');
      console.error('   node scripts/test-newsletter.js your@email.com');
      process.exit(1);
    }

    // 1. Fetch jobs from past 7 days
    const jobsResult = await pool.query(`
      SELECT id, title, company, location, salary, category, slug, posted_date
      FROM jobs
      WHERE created_at >= NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const weeklyJobs = jobsResult.rows;
    console.log(`✓ Found ${weeklyJobs.length} jobs from the past week\n`);

    // 2. Get latest blog post
    const latestBlogPost = {
      title: 'From Retail to Remote Developer: A 6-Month Transformation Story',
      excerpt: 'How I transitioned from a $28k retail job to a $95k remote developer role without a CS degree.',
      url: 'https://no-commute-jobs.com/blog/become-software-developer-no-degree'
    };

    // 3. Build email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
              line-height: 1.6;
              color: #111827;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f9fafb;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
              color: white;
              padding: 40px 30px;
              border-radius: 12px;
              text-align: center;
              margin-bottom: 30px;
              box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.95;
              font-size: 16px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 20px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .content h2 {
              margin-top: 0;
              color: #111827;
              font-size: 24px;
              font-weight: 700;
            }
            .content p {
              color: #6b7280;
              margin-bottom: 20px;
            }
            .job-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              padding: 20px;
              margin: 15px 0;
              transition: all 0.3s ease;
            }
            .job-card:hover {
              border-color: #2563eb;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
            }
            .job-title {
              font-size: 18px;
              font-weight: bold;
              color: #111827;
              margin: 0 0 5px 0;
            }
            .job-company {
              color: #6b7280;
              font-size: 14px;
              margin: 0 0 10px 0;
            }
            .job-meta {
              display: flex;
              gap: 15px;
              font-size: 13px;
              color: #6b7280;
              flex-wrap: wrap;
            }
            .salary {
              color: #10b981;
              font-weight: 600;
            }
            .category-badge {
              background: #eff6ff;
              color: #2563eb;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              display: inline-block;
            }
            .view-job-link {
              color: #2563eb;
              text-decoration: none;
              font-size: 14px;
              margin-top: 10px;
              display: inline-block;
              font-weight: 600;
            }
            .blog-card {
              background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
              color: white;
              border-radius: 12px;
              padding: 30px;
              margin: 20px 0;
              box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
            }
            .blog-card h3 {
              margin: 0 0 10px 0;
              font-size: 22px;
              font-weight: 700;
            }
            .blog-card p {
              margin: 0 0 15px 0;
              opacity: 0.95;
              color: white;
            }
            .blog-cta {
              background: white;
              color: #2563eb;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 10px;
              display: inline-block;
              font-weight: 700;
              box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
            }
            .view-all {
              background: #2563eb;
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 10px;
              display: inline-block;
              margin: 20px 0;
              font-weight: 700;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 13px;
              margin-top: 30px;
              padding: 20px;
              background: white;
              border-radius: 12px;
            }
            .footer a {
              color: #2563eb;
              text-decoration: none;
            }
            .test-badge {
              background: #fbbf24;
              color: #78350f;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: 700;
              display: inline-block;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <center>
            <div class="test-badge">🧪 TEST EMAIL - Not sent to subscribers</div>
          </center>

          <div class="header">
            <h1>🚀 Your Weekly Remote Jobs</h1>
            <p>Fresh opportunities for ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div class="content">
            <h2>This Week's Top Remote Jobs</h2>
            <p>
              We found ${weeklyJobs.length} new remote jobs for you this week!
            </p>

            ${weeklyJobs.slice(0, 10).map(job => `
              <div class="job-card">
                <h3 class="job-title">${job.title}</h3>
                <p class="job-company">${job.company}</p>
                <div class="job-meta">
                  <span>📍 ${job.location}</span>
                  ${job.salary && job.salary !== 'Competitive' && job.salary.match(/\d/) ? `<span class="salary">💰 ${job.salary}</span>` : ''}
                  <span class="category-badge">${job.category}</span>
                </div>
                <a href="https://no-commute-jobs.com/jobs/${job.id}/${job.slug}" class="view-job-link">
                  View Job →
                </a>
              </div>
            `).join('')}

            <center>
              <a href="https://no-commute-jobs.com" class="view-all">
                View All ${weeklyJobs.length} Jobs →
              </a>
            </center>
          </div>

          <div class="blog-card">
            <h3>📖 Featured Article</h3>
            <p><strong>${latestBlogPost.title}</strong></p>
            <p>${latestBlogPost.excerpt}</p>
            <a href="${latestBlogPost.url}" class="blog-cta">
              Read Full Story →
            </a>
          </div>

          <div class="content">
            <h3 style="margin-top: 0;">Browse by Category</h3>
            <p>
              <a href="https://no-commute-jobs.com/category/software-development" style="color: #2563eb; margin-right: 10px;">💻 Software Dev</a>
              <a href="https://no-commute-jobs.com/category/design" style="color: #2563eb; margin-right: 10px;">🎨 Design</a>
              <a href="https://no-commute-jobs.com/category/marketing" style="color: #2563eb; margin-right: 10px;">📈 Marketing</a>
              <a href="https://no-commute-jobs.com/category/sales" style="color: #2563eb; margin-right: 10px;">💼 Sales</a>
            </p>
          </div>

          <div class="footer">
            <p style="font-weight: 600; color: #111827;">No Commute Jobs</p>
            <p>You're receiving this because you subscribed to No Commute Jobs.</p>
            <p>
              <a href="https://no-commute-jobs.com">Browse Jobs</a> •
              <a href="https://no-commute-jobs.com/blog">Read Blog</a> •
              <a href="https://no-commute-jobs.com/unsubscribe?email=${encodeURIComponent(testEmail)}">Unsubscribe</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
              © 2025 No Commute Jobs. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    // 4. Send test email
    console.log(`📤 Sending test newsletter to: ${testEmail}\n`);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: testEmail,
      subject: `[TEST] 🚀 Your Weekly Remote Jobs - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      headers: {
        'List-Unsubscribe': `<https://no-commute-jobs.com/unsubscribe?email=${encodeURIComponent(testEmail)}>`,
      },
      html: emailHTML
    });

    console.log('✅ TEST newsletter sent successfully!');
    console.log(`\n📧 Check your inbox: ${testEmail}`);
    console.log('\nThis test email includes:');
    console.log(`  • ${weeklyJobs.length} jobs from the past 7 days`);
    console.log(`  • Latest blog post`);
    console.log(`  • Unsubscribe link`);
    console.log(`  • Professional design matching your site colors (#2563eb blue)`);

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error sending test newsletter:', error);
    await pool.end();
    process.exit(1);
  }
}

sendTestNewsletter();
