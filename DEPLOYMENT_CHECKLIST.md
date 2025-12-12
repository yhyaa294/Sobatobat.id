# SobatObat.ai Deployment Checklist

## Pre-Deployment ✓

### Database Setup
- [ ] Run `scripts/001-create-users-table.sql` (users, sessions tables)
- [ ] Run `scripts/005-update-users-table-for-bcrypt.sql` (bcrypt compatibility)
- [ ] Verify tables exist in Neon console
- [ ] Check indexes are created

### Environment Variables (Vercel Dashboard)
- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `AUTH_SECRET` - Generated via `openssl rand -base64 32`
- [ ] `OPENAI_API_KEY` - For AI SDK (optional if using free tier)

### Code Verification
- [ ] `auth.ts` - Credentials provider configured
- [ ] `lib/auth.ts` - bcryptjs functions imported
- [ ] `app/login/page.tsx` - Client component with "use client"
- [ ] `app/register/page.tsx` - Client component with "use client"
- [ ] `app/actions/auth.ts` - Using bcryptjs hash()
- [ ] `app/globals.css` - Mobile optimizations included

### Dependencies
\`\`\`json
{
  "bcryptjs": "3.0.3",
  "next-auth": "4.24.13",
  "next": "16.0.7",
  "@neondatabase/serverless": "1.0.2"
}
\`\`\`

## Deployment Steps

### 1. Local Testing
\`\`\`bash
npm install
npm run dev
# Test at http://localhost:3000
# - Register new account
# - Login with email/password
# - Check /dashboard access
# - Verify logout works
\`\`\`

### 2. Test on Mobile
- Open `http://localhost:3000/login` on iPhone/Android
- Verify touch targets are large (48px+)
- Verify keyboard shows email format
- Verify button feedback is instant
- Check no zoom on input focus

### 3. Push to GitHub
\`\`\`bash
git add .
git commit -m "chore: implement fast mobile login without OAuth"
git push origin main
\`\`\`

### 4. Deploy to Vercel
- Push triggers automatic deployment
- Verify environment variables are set
- Check deployment logs for errors

### 5. Post-Deployment Testing
- [ ] Visit production URL
- [ ] Register new test account
- [ ] Login and access dashboard
- [ ] Test on real mobile device
- [ ] Check performance with Lighthouse

## Rollback Plan

If issues occur:
1. Revert to previous deployment in Vercel dashboard
2. Check DATABASE_URL connection in Neon console
3. Verify AUTH_SECRET is set correctly
4. Check database migration ran successfully

## Performance Monitoring

### Lighthouse Metrics Target
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

### Mobile Experience Metrics
- Touch feedback latency: < 50ms
- Login process: < 2 seconds end-to-end
- Dashboard load after login: < 1 second

## Documentation

- ✅ `FAST_LOGIN_SETUP.md` - Setup guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - This file
- ✅ `PHASE4_IMPLEMENTATION.md` - Phase 4 features
- ✅ `AUTH_SETUP.md` - Auth.js documentation

---

**Version**: 1.0.0
**Release Date**: 2024-12-11
**Deployment Target**: Production
