const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getPool } = require('../../lib/db');
const rateLimit = require('../../lib/rateLimit').default;

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting: 5 requests per minute per IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    await limiter.check(5, ip);
  } catch (error) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const {
      jobTitle,
      company,
      companyUrl,
      location,
      jobType,
      category,
      description,
      applyUrl,
      salary,
      tags,
      email
    } = req.body;

    // Validate required fields
    if (!jobTitle || !company || !location || !category || !description || !applyUrl || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slug = generateJobSlug(jobTitle, company);
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Store job data temporarily (we'll retrieve it after payment)
    const tempJobData = {
      title: jobTitle,
      company,
      slug,
      location,
      salary: salary || 'Competitive',
      type: jobType,
      category,
      tags: tagsArray,
      posted_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description,
      requirements: ['See job description for details'],
      apply_url: applyUrl,
      company_url: companyUrl || '',
      featured: true, // Paid jobs are featured
      source: 'Direct Post',
      email
    };

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Remote Job Listing - 30 Days',
              description: `${jobTitle} at ${company}`,
            },
            unit_amount: 9900, // $99.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/post-job/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/post-job`,
      metadata: {
        jobData: JSON.stringify(tempJobData)
      },
      customer_email: email,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}
