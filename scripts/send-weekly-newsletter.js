import { Resend } from 'resend';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;
const resend = new Resend(process.env.RESEND_API_KEY);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function sendWeeklyNewsletter() {
  try {
    console.log('📧 Starting weekly newsletter send...\n');

    // 1. Get jobs from the past 7 days
    const jobsResult = await pool.query(`
      SELECT id, title, company, location, salary, category, slug, posted_date
      FROM jobs
      WHERE created_at >= NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const weeklyJobs = jobsResult.rows;
    console.log(`✅ Found ${weeklyJobs.length} jobs from the past week`);

    // 2. Get latest blog post (you'll need to update this with your actual blog posts)
    const latestBlogPost = {
      title: 'Remote Work Skills Employers Want in 2025',
      slug: 'remote-promotion-skills',
      excerpt: 'Discover the skills that actually got me promoted in remote tech - it wasn\'t the technical skills that made the difference.',
      url: 'https://no-commute-jobs.com/blog/remote-promotion-skills'
    };

    // 3. Get all active subscribers
    const subscribersResult = await pool.query(
      'SELECT email FROM newsletter_subscribers WHERE is_active = true'
    );

    const subscribers = subscribersResult.rows;
    console.log(`✅ Found ${subscribers.length} active subscribers\n`);

    if (subscribers.length === 0) {
      console.log('⚠️  No active subscribers. Exiting.');
      await pool.end();
      return;
    }

    // 4. Build email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .job-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              transition: border-color 0.2s;
            }
            .job-card:hover {
              border-color: #3b82f6;
            }
            .job-title {
              font-size: 16px;
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
            }
            .job-meta span {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .salary {
              color: #10b981;
              font-weight: 600;
            }
            .blog-card {
              background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
              color: white;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
            }
            .blog-card h3 {
              margin: 0 0 10px 0;
              font-size: 20px;
            }
            .blog-card p {
              margin: 0 0 15px 0;
              opacity: 0.95;
            }
            .cta {
              background: white;
              color: #f59e0b;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              font-weight: bold;
            }
            .view-all {
              background: #3b82f6;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .footer a {
              color: #3b82f6;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 Your Weekly Remote Jobs</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.95;">Fresh opportunities for ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div class="content">
            <h2 style="margin-top: 0;">This Week's Top Remote Jobs</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              We found ${weeklyJobs.length} new remote jobs for you this week!
            </p>

            ${weeklyJobs.slice(0, 10).map(job => `
              <div class="job-card">
                <h3 class="job-title">${job.title}</h3>
                <p class="job-company">${job.company}</p>
                <div class="job-meta">
                  <span>📍 ${job.location}</span>
                  ${job.salary && job.salary !== 'Competitive' && job.salary.match(/\d/) ? `<span class="salary">💰 ${job.salary}</span>` : ''}
                  <span>🏷️ ${job.category}</span>
                </div>
                <a href="https://no-commute-jobs.com/jobs/${job.id}/${job.slug}" style="color: #3b82f6; text-decoration: none; font-size: 14px; margin-top: 10px; display: inline-block;">
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
            <a href="${latestBlogPost.url}" class="cta">
              Read More →
            </a>
          </div>

          <div class="content">
            <h3>Browse by Category</h3>
            <p>
              <a href="https://no-commute-jobs.com/category/software-development" style="color: #3b82f6; margin-right: 10px;">💻 Software Dev</a>
              <a href="https://no-commute-jobs.com/category/design" style="color: #3b82f6; margin-right: 10px;">🎨 Design</a>
              <a href="https://no-commute-jobs.com/category/marketing" style="color: #3b82f6; margin-right: 10px;">📈 Marketing</a>
              <a href="https://no-commute-jobs.com/category/sales" style="color: #3b82f6; margin-right: 10px;">💼 Sales</a>
            </p>
          </div>

          <div class="footer">
            <p>You're receiving this because you subscribed to No Commute Jobs.</p>
            <p><a href="https://no-commute-jobs.com">Browse Jobs</a> | <a href="https://no-commute-jobs.com/blog">Read Blog</a> | <a href="#">Unsubscribe</a></p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
              © 2025 No Commute Jobs. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    // 5. Send emails (batch send with Resend)
    console.log('📤 Sending newsletters...\n');

    let sent = 0;
    let failed = 0;

    // Resend allows batch sending up to 100 emails at once
    const batchSize = 100;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev', // Update to your custom domain when ready
          to: batch.map(s => s.email),
          subject: `🚀 ${weeklyJobs.length} New Remote Jobs This Week`,
          html: emailHTML
        });

        sent += batch.length;
        console.log(`✅ Sent batch ${Math.floor(i / batchSize) + 1}: ${batch.length} emails`);

        // Rate limit: wait 1 second between batches
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Failed to send batch ${Math.floor(i / batchSize) + 1}:`, error);
        failed += batch.length;
      }
    }

    console.log(`\n✅ Newsletter send complete!`);
    console.log(`   📧 Sent: ${sent}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total jobs featured: ${weeklyJobs.length}`);

    await pool.end();
  } catch (error) {
    console.error('❌ Error sending newsletter:', error);
    await pool.end();
    process.exit(1);
  }
}

sendWeeklyNewsletter();
