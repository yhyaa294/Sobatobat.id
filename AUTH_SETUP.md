# Auth.js v5 Setup Guide for SobatObat.ai

## Overview
This application uses Next-Auth v5 with Google OAuth for authentication and Vercel Postgres for data persistence.

## Prerequisites
- Google OAuth credentials (Client ID & Secret)
- Vercel PostgreSQL database (Neon)
- Environment variables configured

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" > "Create OAuth 2.0 ID"
5. Choose "Web Application"
6. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (development)
   - https://yourdomain.com/api/auth/callback/google (production)
7. Copy Client ID and Client Secret

## Step 2: Set Environment Variables

Add to your `.env.local` or Vercel Environment Variables:

\`\`\`
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
DATABASE_URL=your_neon_postgres_url
AUTH_SECRET=generate_random_secret_here
\`\`\`

### Generate AUTH_SECRET:
\`\`\`bash
openssl rand -base64 32
\`\`\`

## Step 3: Run Database Migration

1. Connect to your Neon database
2. Run the migration script:
   - `scripts/003-auth-js-migration.sql`
3. This creates Auth.js standard tables: users, accounts, sessions, verificationTokens

## Step 4: Update Login Page

The login page now shows:
- "Masuk dengan Google" button for OAuth login
- Guest access option to explore without login
- Professional SobatObat.ai branding

## Features

### Session Management
- Session tokens stored in PostgreSQL via Auth.js adapter
- Automatic session validation
- User profile with Google avatar support
- 30-day session expiry (configurable)

### User Data
Auth.js automatically stores:
- User ID, name, email, image (from Google)
- Account provider info
- Session tokens

### Logout
- Client-side signOut via `next-auth/react`
- Automatic session deletion
- Redirect to homepage

## Files Modified/Created

### New Files
- `auth.ts` - Auth.js configuration (Google provider, callbacks, adapter)
- `app/api/auth/[...nextauth]/route.ts` - Auth API routes
- `proxy.ts` - Middleware for route protection
- `AUTH_SETUP.md` - This file

### Updated Files
- `app/login/page.tsx` - OAuth login form
- `app/dashboard/page.tsx` - Auth session validation
- `components/dashboard-client.tsx` - Accept Auth.js user type
- `components/sidebar.tsx` - Use next-auth/react signOut
- `package.json` - Added next-auth and @auth/pg-adapter

## Testing

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/login
3. Click "Masuk dengan Google"
4. Authenticate with your Google account
5. Should redirect to /dashboard with user info
6. Check user greeting shows your Google name/email
7. Test logout button - should clear session

## Troubleshooting

### "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET"
- Check environment variables are set correctly
- Restart dev server after adding env vars

### "Invalid redirect_uri"
- Ensure callback URL matches exactly in Google Cloud Console
- For localhost: `http://localhost:3000/api/auth/callback/google`

### Database errors
- Run migration script in Neon console
- Verify DATABASE_URL is correct

### Session not persisting
- Check cookies are enabled in browser
- Verify AUTH_SECRET is set
- Check database connection

## Next Steps

1. Test Google OAuth flow completely
2. Deploy to Vercel
3. Add production Google OAuth credentials to Vercel env vars
4. Consider adding more OAuth providers (GitHub, Microsoft, etc.)
5. Implement refresh token strategy for better security
