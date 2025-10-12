# Database Schema Update - Job Verification System

## Add Status Column to Jobs Table

Run this SQL command in your PostgreSQL database:

```sql
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add verification fields
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS submitter_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;

-- Update existing jobs to have 'active' status
UPDATE jobs SET status = 'active' WHERE status IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_verification_token ON jobs(verification_token);
```

## Status Values
- `pending` - Job posted but waiting for admin verification
- `active` - Job is live and visible on the site
- `rejected` - Job was rejected by admin
- `expired` - Job has passed 30 days

## Next Steps
1. Run the SQL commands above in your database
2. The webhook will now create jobs with 'pending' status
3. You'll receive an email to verify each job before it goes live
