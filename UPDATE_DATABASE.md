# How to Update Your Job Database

## Option 1: Run Scraper Locally (Quickest)

From your project root, run:

```bash
cd scraper
node scraper.js
```

This will:
- Scrape RemoteOK, We Work Remotely, and Remotive
- Add new jobs to your database
- Remove jobs older than 60 days
- Show you a summary of what was added

## Option 2: Set Up Automatic Updates on Render

### Create a Cron Job:

1. Go to Render Dashboard
2. Click "New" → "Cron Job"
3. Fill in:
   - **Name:** `job-scraper`
   - **Environment:** Same as your web service
   - **Build Command:** `cd scraper && npm install`
   - **Command:** `cd scraper && node scraper.js`
   - **Schedule:** `0 0 * * *` (daily at midnight)

4. Add Environment Variables:
   - `DATABASE_URL` (same as your web service)

5. Click "Create Cron Job"

Now your database will update automatically every day!

## Option 3: Manual Deploy on Render

If you have a web service for the scraper:

1. Go to your scraper service on Render
2. Click "Manual Deploy" → "Deploy latest commit"
3. This will run the scraper once

---

## Checking Database Status

### Via Render Dashboard:
1. Go to your PostgreSQL database on Render
2. Click "Connect" → "External Connection"
3. Use a tool like pgAdmin or TablePlus to connect
4. Run: `SELECT COUNT(*) FROM jobs;`
5. Check the `created_at` timestamps to see recent jobs

### Via Your Website:
1. Visit your homepage
2. Check the job count and dates
3. Look for recent postings (0d ago, 1d ago)

---

## Scraper Schedule Recommendations

- **Daily:** `0 0 * * *` - Best for most sites
- **Twice Daily:** `0 */12 * * *` - For high-volume sites
- **Weekly:** `0 0 * * 0` - For low-traffic sites

---

## Troubleshooting

### Jobs not updating?
- Check Render cron job logs
- Verify DATABASE_URL is set correctly
- Run scraper locally to test connection

### Scraper failing?
- Check API rate limits (RemoteOK, Remotive)
- Verify internet connection from Render
- Check database connection string

---

**Recommended:** Set up the cron job for automatic daily updates!
