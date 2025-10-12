# How to Scrape Remote Jobs from Google

## Problem: Google Doesn't Have a Public API

Google Jobs doesn't provide a free public API, but you have several options:

---

## ✅ Option 1: Use SerpAPI (Recommended)

SerpAPI provides Google Jobs results via a simple API.

### Setup:

1. **Sign up for SerpAPI:**
   - Go to: https://serpapi.com/
   - Create a free account
   - Free tier: 100 searches/month
   - Paid: $50/month for 5,000 searches

2. **Get your API key:**
   - Dashboard → API Key
   - Copy your key

3. **Add to `.env.local`:**
   ```bash
   SERPAPI_KEY=your_api_key_here
   ```

4. **Run the Google Jobs scraper:**
   ```bash
   cd scraper
   node google-jobs-scraper.js
   ```

### Pros:
- ✅ Official API
- ✅ Clean, structured data
- ✅ Reliable
- ✅ Easy to use

### Cons:
- ❌ Costs money (after 100 free searches/month)
- ❌ Rate limited

---

## Option 2: Use LinkedIn Jobs API

LinkedIn has better remote job listings and an unofficial API:

### Free Alternative - RapidAPI LinkedIn Scraper:
- https://rapidapi.com/rockapis-rockapis-default/api/linkedin-data-scraper/
- Free tier: 100 requests/month
- Better for remote jobs than Google

---

## Option 3: Manual Import Feature

Create a simple admin page where you can paste job URLs and import them:

### Create `/pages/admin/import-job.js`:
```javascript
// Simple form where you paste a job URL
// Extracts company, title, description
// Adds to database
```

This gives you full control over job quality!

---

## Option 4: Use Existing Free APIs

Instead of Google, use these free job APIs:

### 1. **Remotive API** (Free!)
Already in your scraper - very good for remote jobs

### 2. **RemoteOK API** (Free!)
Already in your scraper - largest remote job board

### 3. **We Work Remotely RSS** (Free!)
Already in your scraper

### 4. **Himalayas Jobs** (Free API)
```
https://himalayas.app/jobs/api
```

### 5. **Remote.co** (Has RSS feed)
```
https://remote.co/remote-jobs/developer/
```

---

## Recommended Approach:

### For now, stick with what you have:
1. RemoteOK (free, unlimited)
2. Remotive (free, unlimited)
3. We Work Remotely (free, unlimited)

These give you 1000+ quality remote jobs for FREE!

### If you want Google Jobs:
1. Sign up for SerpAPI free tier (100 searches/month)
2. Run the scraper monthly
3. Supplement your existing jobs

---

## Cost Comparison:

| Service | Free Tier | Paid |
|---------|-----------|------|
| **RemoteOK** | ✅ Unlimited | Free |
| **Remotive** | ✅ Unlimited | Free |
| **WWR** | ✅ Unlimited | Free |
| **SerpAPI (Google)** | 100/month | $50/mo for 5K |
| **LinkedIn via RapidAPI** | 100/month | $10/mo for 1K |

---

## My Recommendation:

**Don't use Google Jobs yet.** Your current scrapers are:
- ✅ Free
- ✅ High quality
- ✅ Focused on remote jobs
- ✅ Reliable

Google Jobs includes many non-remote jobs, so you'd get less relevant results.

**Better idea:** Improve your existing scrapers by:
1. Running them daily (set up Render cron job)
2. Adding more free sources (Himalayas, Remote.co)
3. Focusing on job quality over quantity

---

## To Add More Free Job Sources:

I can help you add:
- Himalayas Jobs (free API)
- Remote.co (RSS feed)
- FlexJobs (if they have a feed)
- Working Nomads (has API)

These would give you even more jobs WITHOUT any cost!

Let me know if you want me to add any of these! 🚀
