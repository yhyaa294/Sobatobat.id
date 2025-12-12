-- Drop old manual auth tables to prepare for Auth.js standard schema
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Auth.js standard tables for PostgreSQL adapter
-- User table
CREATE TABLE users (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMP,
  image TEXT
);

-- Account table (for OAuth providers)
CREATE TABLE accounts (
  id TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider, "providerAccountId")
);

-- Session table
CREATE TABLE sessions (
  id TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  "sessionToken" TEXT UNIQUE NOT NULL,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Verification token table
CREATE TABLE "verificationTokens" (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Recreate medicines table with FK to new user schema
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  expiry_date DATE,
  stock INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_accounts_userId ON accounts("userId");
CREATE INDEX idx_sessions_userId ON sessions("userId");
CREATE INDEX idx_medicines_userId ON medicines("userId");
CREATE INDEX idx_medicines_expiry ON medicines(expiry_date);
