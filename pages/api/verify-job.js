const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, action } = req.query;

  if (!token || !action) {
    return res.status(400).json({ error: 'Missing token or action' });
  }

  if (action !== 'approve' && action !== 'reject') {
    return res.status(400).json({ error: 'Invalid action. Must be approve or reject' });
  }

  try {
    // Find the job with this verification token
    const result = await pool.query(
      'SELECT id, title, company, status FROM jobs WHERE verification_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Failed</title>
          <style>
            body { font-family: system-ui; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            h1 { color: #ef4444; }
          </style>
        </head>
        <body>
          <h1>❌ Invalid Token</h1>
          <p>This verification link is invalid or has already been used.</p>
        </body>
        </html>
      `);
    }

    const job = result.rows[0];

    if (job.status !== 'pending') {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Already Processed</title>
          <style>
            body { font-family: system-ui; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            h1 { color: #f59e0b; }
          </style>
        </head>
        <body>
          <h1>⚠️ Already Processed</h1>
          <p>This job has already been ${job.status === 'active' ? 'approved' : 'processed'}.</p>
          <p><strong>${job.title}</strong> at ${job.company}</p>
        </body>
        </html>
      `);
    }

    // Update job status
    const newStatus = action === 'approve' ? 'active' : 'rejected';
    const verified_at = action === 'approve' ? new Date() : null;

    await pool.query(
      'UPDATE jobs SET status = $1, verified_at = $2, verification_token = NULL WHERE id = $3',
      [newStatus, verified_at, job.id]
    );

    // Return success page
    if (action === 'approve') {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Job Approved</title>
          <style>
            body { font-family: system-ui; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            h1 { color: #10b981; }
            .job-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            a { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            a:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <h1>✅ Job Approved!</h1>
          <div class="job-details">
            <h2>${job.title}</h2>
            <p>${job.company}</p>
          </div>
          <p>This job is now live on No Commute Jobs and visible to all job seekers.</p>
          <a href="https://no-commute-jobs.com">View on Site</a>
        </body>
        </html>
      `);
    } else {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Job Rejected</title>
          <style>
            body { font-family: system-ui; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            h1 { color: #ef4444; }
            .job-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>❌ Job Rejected</h1>
          <div class="job-details">
            <h2>${job.title}</h2>
            <p>${job.company}</p>
          </div>
          <p>This job has been rejected and will not appear on the site.</p>
        </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error verifying job:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body { font-family: system-ui; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
          h1 { color: #ef4444; }
        </style>
      </head>
      <body>
        <h1>❌ Error</h1>
        <p>An error occurred while processing your request. Please try again later.</p>
      </body>
      </html>
    `);
  }
}
