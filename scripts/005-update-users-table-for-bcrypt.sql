-- Update password_hash column to accommodate bcrypt hashes (60+ chars)
ALTER TABLE users 
ALTER COLUMN password_hash SET DATA TYPE VARCHAR(255);

-- Ensure the column is NOT NULL
ALTER TABLE users 
ALTER COLUMN password_hash SET NOT NULL;

-- Drop old sessions table if migrating from session-based to Auth.js
-- This is optional - you can keep both for gradual migration
-- DROP TABLE IF EXISTS sessions CASCADE;

-- Auth.js standard tables (if not already created by adapter)
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(255),
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_identifier ON verification_tokens(identifier);
