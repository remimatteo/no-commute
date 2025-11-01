import { Resend } from 'resend';
import pg from 'pg';
import rateLimit from 'express-rate-limit';

const { Pool } = pg;

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiter: Max 5 newsletter signups per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many signup attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Wrapper to make express-rate-limit work with Next.js API routes
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply rate limiting
  try {
    await runMiddleware(req, res, limiter);
  } catch (error) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 1. Check if email already exists
    const existingCheck = await pool.query(
      'SELECT email, is_active FROM newsletter_subscribers WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingCheck.rows.length > 0) {
      const existing = existingCheck.rows[0];

      if (existing.is_active) {
        await pool.end();
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed!'
        });
      } else {
        // Re-activate subscription
        await pool.query(
          'UPDATE newsletter_subscribers SET is_active = true, subscribed_at = NOW(), unsubscribed_at = NULL WHERE email = $1',
          [email.toLowerCase()]
        );
        await pool.end();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    // 2. Add new subscriber to database
    await pool.query(
      'INSERT INTO newsletter_subscribers (email, subscribed_at, is_active) VALUES ($1, NOW(), true)',
      [email.toLowerCase()]
    );

    // 3. Send welcome email via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to No Commute Jobs! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #f9fafb; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
              .feature { margin: 15px 0; padding-left: 25px; position: relative; }
              .feature:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
              .cta { background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Welcome to No Commute Jobs! 🎉</h1>
            </div>

            <div class="content">
              <p>Hi there!</p>

              <p>Thanks for subscribing to our weekly remote job newsletter. You've just taken the first step toward finding your perfect work-from-anywhere opportunity!</p>

              <p><strong>Here's what you'll receive every week:</strong></p>

              <div class="feature">Latest remote job postings across all categories</div>
              <div class="feature">Featured blog post with career tips and insights</div>
              <div class="feature">Curated opportunities from top remote-first companies</div>
              <div class="feature">Remote work tips and industry trends</div>

              <p>Your first newsletter arrives next week. In the meantime, why not browse our latest jobs?</p>

              <center>
                <a href="https://no-commute-jobs.com" class="cta">Browse Remote Jobs Now</a>
              </center>

              <p>Looking for something specific? Check out our categories:</p>
              <p>
                <a href="https://no-commute-jobs.com/category/software-development">💻 Software Development</a> •
                <a href="https://no-commute-jobs.com/category/design">🎨 Design</a> •
                <a href="https://no-commute-jobs.com/category/marketing">📈 Marketing</a>
              </p>
            </div>

            <div class="footer">
              <p>No Commute Jobs - Find Your Perfect Remote Job</p>
              <p><a href="https://no-commute-jobs.com">no-commute-jobs.com</a></p>
            </div>
          </body>
        </html>
      `
    });

    await pool.end();

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);

    try {
      await pool.end();
    } catch (e) {
      // Ignore pool close error
    }

    return res.status(500).json({
      error: 'Failed to subscribe. Please try again later.'
    });
  }
}
