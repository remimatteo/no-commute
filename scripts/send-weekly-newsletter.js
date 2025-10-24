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

    // 2. Get latest blog post
    const latestBlogPost = {
      title: 'Remote Work Skills Employers Want in 2025',
      slug: 'remote-promotion-skills',
      excerpt: 'Discover the skills that actually got me promoted in remote tech - it wasn\'t the technical skills that made the difference.',
      url: 'https://no-commute-jobs.com/blog/remote-promotion-skills'
    };

    // 3. Get side hustle articles
    const sideHustles = [
      {
        title: 'Best Side Hustles for 2025: 12 Proven Ways to Make Extra Money',
        url: 'https://no-commute-jobs.com/make-money-online/best-side-hustles-2025'
      },
      {
        title: 'AI Side Hustles: How to Make Money with ChatGPT and AI Tools',
        url: 'https://no-commute-jobs.com/make-money-online/ai-side-hustles'
      },
      {
        title: 'Survey Sites That Actually Pay in 2025',
        url: 'https://no-commute-jobs.com/make-money-online/survey-sites-that-pay'
      },
      {
        title: 'How to Sell Digital Products Online',
        url: 'https://no-commute-jobs.com/make-money-online/sell-digital-products-online'
      }
    ];

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

    // 4. Build email HTML - Clean, professional design
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #e5e7eb;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #111827;
              font-weight: 600;
            }
            .header p {
              margin: 5px 0 0 0;
              font-size: 14px;
              color: #6b7280;
            }
            .blog-section {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #3b82f6;
            }
            .blog-section h2 {
              margin: 0 0 10px 0;
              font-size: 18px;
              color: #111827;
            }
            .blog-link {
              color: #3b82f6;
              text-decoration: none;
              font-weight: 500;
            }
            .blog-link:hover {
              text-decoration: underline;
            }
            .jobs-section {
              margin-bottom: 30px;
            }
            .jobs-section h2 {
              font-size: 20px;
              color: #111827;
              margin: 0 0 20px 0;
            }
            .job-item {
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .job-item:last-child {
              border-bottom: none;
            }
            .job-title {
              font-size: 15px;
              font-weight: 500;
              color: #111827;
              text-decoration: none;
              display: block;
              margin-bottom: 4px;
            }
            .job-title:hover {
              color: #3b82f6;
            }
            .job-salary {
              font-size: 13px;
              color: #10b981;
              font-weight: 600;
            }
            .side-hustles-section {
              background: #fffbeb;
              padding: 25px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #f59e0b;
            }
            .side-hustles-section h3 {
              margin: 0 0 10px 0;
              font-size: 16px;
              color: #92400e;
            }
            .side-hustles-section p {
              margin: 0 0 15px 0;
              font-size: 14px;
              color: #78350f;
            }
            .side-hustle-link {
              display: block;
              color: #d97706;
              text-decoration: none;
              font-size: 14px;
              margin-bottom: 8px;
              padding-left: 12px;
              position: relative;
            }
            .side-hustle-link:before {
              content: "→";
              position: absolute;
              left: 0;
            }
            .side-hustle-link:hover {
              text-decoration: underline;
            }
            .cta-button {
              text-align: center;
              margin: 30px 0;
            }
            .cta-button a {
              background: #3b82f6;
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              font-weight: 600;
              font-size: 15px;
            }
            .cta-button a:hover {
              background: #2563eb;
            }
            .footer {
              text-align: center;
              color: #9ca3af;
              font-size: 13px;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .footer a {
              color: #6b7280;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
            .banner-image {
              width: 100%;
              max-width: 600px;
              height: auto;
              display: block;
              margin: 0 auto 20px auto;
            }
            .welcome-section {
              background: #fef3c7;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border: 1px solid #fbbf24;
            }
            .welcome-section p {
              margin: 0;
              font-size: 15px;
              color: #374151;
              line-height: 1.7;
            }
            .welcome-signature {
              margin-top: 12px;
              font-style: italic;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <!-- Email Banner -->
          <img src="https://no-commute-jobs.com/email-banner.png" alt="No Commute Jobs" class="banner-image" />

          <!-- Header -->
          <div class="header">
            <h1>No Commute Jobs</h1>
            <p>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <!-- Welcome Message (First Newsletter Only) -->
          <div class="welcome-section">
            <p>Hi—thanks for subscribing to No Commute Jobs, a new remote job board! I wanted to thank you for being one of my first 20 subscribers! Please let me know if you ever have any suggestions for the site, and what you'd like to see more of.</p>
            <p class="welcome-signature">— Remi, founder</p>
          </div>

          <!-- Featured Blog Post -->
          <div class="blog-section">
            <h2>📖 Featured Article</h2>
            <a href="${latestBlogPost.url}" class="blog-link">${latestBlogPost.title} →</a>
          </div>

          <!-- Jobs Section -->
          <div class="jobs-section">
            <h2>This Week's Top Remote Jobs (${weeklyJobs.length} new)</h2>
            ${weeklyJobs.slice(0, 12).map(job => `
              <div class="job-item">
                <a href="https://no-commute-jobs.com/jobs/${job.id}/${job.slug}" class="job-title">
                  ${job.title}
                </a>
                ${job.salary && job.salary !== 'Competitive' && job.salary.match(/\d/) ?
                  `<span class="job-salary">${job.salary}</span>` :
                  ''}
              </div>
            `).join('')}
          </div>

          <!-- Side Hustles Section -->
          <div class="side-hustles-section">
            <h3>💰 While You Wait for Recruiters...</h3>
            <p>Check out these side hustle guides we've published to make money in the meantime:</p>
            ${sideHustles.map(hustle => `
              <a href="${hustle.url}" class="side-hustle-link">${hustle.title}</a>
            `).join('')}
          </div>

          <!-- CTA Button -->
          <div class="cta-button">
            <a href="https://no-commute-jobs.com">See All Jobs</a>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>You're receiving this because you subscribed to No Commute Jobs.</p>
            <p style="margin-top: 10px;">
              <a href="https://no-commute-jobs.com">Browse Jobs</a> ·
              <a href="https://no-commute-jobs.com/blog">Blog</a> ·
              <a href="https://no-commute-jobs.com/make-money-online">Side Hustles</a> ·
              <a href="#">Unsubscribe</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px;">
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
