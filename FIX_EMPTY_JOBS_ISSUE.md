# Fix: Jobs Not Showing on First Load

## The Problem
When you visit category pages (like `/category/software-development`), they show 0 jobs initially and require multiple refreshes to show jobs.

## Root Cause
This is a **caching issue** with Next.js ISR (Incremental Static Regeneration):

1. During build, category pages ARE generated with jobs ✅
2. But when deployed, old cached versions (with 0 jobs) are being served ❌
3. The `revalidate: 21600` (6 hours) means pages only regenerate every 6 hours

## Solutions

### Solution 1: Clear Vercel Cache (If using Vercel)

**Option A - From Vercel Dashboard:**
1. Go to your Vercel project dashboard
2. Settings → Data Cache
3. Click "Purge Everything"
4. Redeploy

**Option B - From Command Line:**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login
vercel login

# Redeploy with forced rebuild
vercel --prod --force
```

---

### Solution 2: Force Page Regeneration via API

I've added better serialization and logging. Now you can force pages to regenerate by visiting them with `?revalidate=1`:

```
https://no-commute-jobs.com/category/software-development?revalidate=1
https://no-commute-jobs.com/category/design?revalidate=1
https://no-commute-jobs.com/category/marketing?revalidate=1
```

This won't work automatically - you need to enable it. Skip this for now.

---

### Solution 3: Reduce Revalidate Time (Temporary Fix)

Change the revalidate time from 6 hours to 1 minute temporarily to force fresh data:

**File:** `pages/category/[slug].js` (line 466)

**Change:**
```javascript
revalidate: 21600 // 6 hours
```

**To:**
```javascript
revalidate: 60 // 1 minute (temporary - for testing)
```

Then after deployment works, change back to:
```javascript
revalidate: 3600 // 1 hour (good balance)
```

---

### Solution 4: Verify Build Output Locally

Before deploying, verify that jobs ARE in the built pages:

```bash
npm run build

# Check build output for category pages:
# Look for lines like:
# ├ ● /category/[slug] (47427 ms)
# ├   ├ /category/software-development (3212 ms)

# If the build time is >2 seconds per page, it's fetching data
```

Then start production build locally:
```bash
npm start

# Visit: http://localhost:3000/category/software-development
# Check browser console for logs:
# [CategoryJobs] Initial jobs count: 119
```

If you see jobs locally but not in production → it's a deployment cache issue.

---

## Recommended Fix (Do This Now)

1. **Commit the debugging code** (already done ✅)

2. **Temporarily reduce revalidate time:**
