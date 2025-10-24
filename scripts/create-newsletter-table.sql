-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries on active subscribers
CREATE INDEX IF NOT EXISTS idx_active_subscribers ON newsletter_subscribers(is_active) WHERE is_active = true;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email ON newsletter_subscribers(email);

COMMENT ON TABLE newsletter_subscribers IS 'Stores email addresses for weekly newsletter subscribers';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN newsletter_subscribers.is_active IS 'Whether subscriber is currently active (not unsubscribed)';
