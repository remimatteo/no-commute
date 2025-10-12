const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
      // Retrieve job data from session metadata
      const jobData = JSON.parse(session.metadata.jobData);

      // Insert job into database
      await pool.query(
        `INSERT INTO jobs
        (title, company, slug, location, salary, type, category, tags, posted_date, description, requirements, apply_url, company_url, featured, source)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
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
          jobData.source
        ]
      );

      console.log('✅ Job posted successfully:', jobData.title);

      // TODO: Send confirmation email to jobData.email

    } catch (error) {
      console.error('Error inserting job:', error);
      return res.status(500).json({ error: 'Failed to insert job' });
    }
  }

  res.json({ received: true });
}
