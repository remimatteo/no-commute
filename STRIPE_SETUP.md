# Stripe Setup Guide for No Commute Jobs

## Overview
This guide will help you set up Stripe webhooks to automatically publish job postings after successful payment.

## Environment Variables
Your `.env.local` file already contains:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with pk_live)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with sk_live)
- `STRIPE_WEBHOOK_SECRET` - You need to get this from Stripe (see below)

## Setting Up Stripe Webhooks

### 1. Log in to Stripe Dashboard
Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)

### 2. Navigate to Webhooks
- Click on **Developers** in the top menu
- Click on **Webhooks** in the sidebar

### 3. Add an Endpoint
- Click **"Add endpoint"**
- Enter your webhook URL:
  - For local development: `http://localhost:3000/api/webhook` (use Stripe CLI for testing)
  - For production: `https://no-commute-jobs.com/api/webhook`

### 4. Select Events to Listen To
Select the following event:
- `checkout.session.completed`

### 5. Get Your Webhook Secret
After creating the endpoint, Stripe will show you a webhook signing secret (starts with `whsec_`).

Copy this and update your `.env.local` file:
```
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
```

### 6. For Local Testing (Optional)
To test webhooks locally, use the Stripe CLI:

```bash
# Install Stripe CLI
# Windows: Download from https://github.com/stripe/stripe-cli/releases
# Mac: brew install stripe/stripe-cli/stripe
# Linux: See https://stripe.com/docs/stripe-cli#install

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhook

# This will give you a webhook secret starting with whsec_
# Use this in your .env.local for local development
```

## Testing the Payment Flow

### 1. Start your development server
```bash
npm run dev
```

### 2. Navigate to Post a Job
Go to `http://localhost:3000/post-job`

### 3. Fill out the form and use Stripe test cards
For testing, use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiration date, any 3-digit CVC, and any ZIP code

### 4. After successful payment
The webhook will automatically:
1. Receive the payment confirmation from Stripe
2. Extract the job data from the session metadata
3. Insert the job into your PostgreSQL database
4. Redirect the user to the success page

## Production Deployment

### On Vercel (or your hosting platform):
1. Add all environment variables to your hosting platform:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `DATABASE_URL`

2. Update the Stripe webhook endpoint URL to your production domain

3. Make sure your database is accessible from your hosting platform

## Troubleshooting

### Webhook not firing?
- Check Stripe Dashboard > Developers > Webhooks > Your endpoint
- Look at the "Recent deliveries" section to see if Stripe is sending events
- Check if there are any error messages

### Job not appearing after payment?
- Check your server logs for any database errors
- Verify your DATABASE_URL is correct
- Make sure the `jobs` table exists with all required columns

### Payment not processing?
- Verify your Stripe keys are correct (pk_live and sk_live)
- Check browser console for any JavaScript errors
- Ensure Stripe.js is loaded (check network tab)

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env.local` to git
- The `.env.local` file is in `.gitignore` by default
- Keep your Stripe secret key and webhook secret confidential
- For production, consider using environment variables from your hosting platform

## Support

If you encounter issues:
1. Check Stripe Dashboard logs
2. Check your application server logs
3. Verify all environment variables are set correctly
4. Test with Stripe test mode first before going live

## Price Configuration

The current price is set to **$49** in the file:
- `pages/api/create-checkout-session.js` (line with `unit_amount: 4900`)

To change the price, update the `unit_amount` value (price in cents):
- $49 = 4900 cents
- $99 = 9900 cents
- etc.
