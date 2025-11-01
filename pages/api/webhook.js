const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getPool } = require('../../lib/db.cjs');

// Disable body parsing, need raw body for Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

const getRawBody = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const pool = getPool();

      // Retrieve job data from session metadata
      const jobData = JSON.parse(session.metadata.jobData);

      // Generate verification token
      const verificationToken = require('crypto').randomBytes(32).toString('hex');

      // Insert job into database with pending status
      await pool.query(
        `INSERT INTO jobs
        (title, company, slug, location, salary, type, category, tags, posted_date, description, requirements, apply_url, company_url, featured, source, status, submitter_email, verification_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          jobData.title,
          jobData.company,
          jobData.slug,
          jobData.location,
          jobData.salary,
          jobData.type,
          jobData.category,
          jobData.tags,
          jobData.posted_date,
          jobData.description,
          jobData.requirements,
          jobData.apply_url,
          jobData.company_url,
          jobData.featured,
          jobData.source,
          'pending',  // Job starts as pending
          jobData.email,
          verificationToken
        ]
      );

      console.log('✅ Job submitted for verification:', jobData.title);

      // Send verification email to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'your-email@example.com';
      const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://no-commute-jobs.com'}/api/verify-job?token=${verificationToken}&action=approve`;
      const rejectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://no-commute-jobs.com'}/api/verify-job?token=${verificationToken}&action=reject`;

      console.log('📧 Verification URLs:');
      console.log('Approve:', verifyUrl);
      console.log('Reject:', rejectUrl);
      console.log('\n📋 Job Details:');
      console.log('Title:', jobData.title);
      console.log('Company:', jobData.company);
      console.log('Location:', jobData.location);
      console.log('Apply URL:', jobData.apply_url);
      console.log('Submitter:', jobData.email);

      // TODO: Send actual email using SendGrid, Resend, or similar service
      // For now, we're logging the URLs so you can manually verify

    } catch (error) {
      console.error('Error inserting job:', error);
      return res.status(500).json({ error: 'Failed to insert job' });
    }
  }

  res.json({ received: true });
}
