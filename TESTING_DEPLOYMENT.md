# Body Fit Training - Testing & Deployment Guide

## 🧪 Testing Procedures

### Manual Testing Checklist

#### 1. Landing Page Load Test
```bash
npm run dev
# Navigate to http://localhost:3000
```

**Expected Results:**
- [ ] Page loads without errors
- [ ] Hero section displays: "Transform with CERTAINTY"
- [ ] Founder name: "Vikram Valecha" visible
- [ ] Three membership tier cards visible:
  - 1 Month - ₹1,200
  - 3 Months - ₹3,400
  - 6 Months - ₹7,000
- [ ] "Get Started" button visible and clickable
- [ ] Colors match theme:
  - Black background (#1A1C1E)
  - Forest Green accents (#3B4D3C)
  - Slate Grey (#2F353B)

#### 2. Phone Capture Modal Test
```
1. Click "Get Started" button
```

**Expected Results:**
- [ ] Modal opens with overlay
- [ ] Close button (X) visible
- [ ] Title: "Start Your Transformation" visible
- [ ] Phone input field visible with placeholder
- [ ] "Continue to OTP Login" button visible
- [ ] Input only accepts digits (0-9)
- [ ] Input max length: 10 digits

#### 3. Phone Validation Test
```
Valid phone:   9876543210 → Should submit
Invalid phone:  123        → Should show error
Invalid input:  abc        → Should reject non-digits
```

**Expected Results:**
- [ ] Valid 10-digit phone submits successfully
- [ ] Invalid phones show error message
- [ ] Non-numeric characters ignored

#### 4. Lead Storage Test
```
Before: Check Supabase dashboard → leads table
Submit: Valid phone number
After: Refresh Supabase dashboard
```

**Expected Results:**
- [ ] New row appears in `leads` table
- [ ] Phone number matches input
- [ ] Timestamp auto-populated with current time
- [ ] ID generated (UUID)

#### 5. Modal Success Flow Test
```
Submit valid phone from modal
```

**Expected Results:**
- [ ] Success message shows: "✓ Submission successful..."
- [ ] Modal displays: "Redirecting to login..."
- [ ] After 2 seconds: Redirect happens (currently goes to /auth/login)
- [ ] No console errors (F12 to check)

#### 6. Responsive Design Test
```bash
F12 → Toggle device toolbar
Test at: 320px, 480px, 768px, 1024px, 1440px widths
```

**Expected Results:**
- [ ] Mobile (320px): Text readable, buttons clickable, modal responsive
- [ ] Tablet (768px): Layout adjusts properly
- [ ] Desktop (1440px): Full width layout displays correctly
- [ ] No horizontal scrollbar at any size
- [ ] Font sizes readable on all devices

#### 7. Owner Account Creation Test
```bash
# Terminal 1: Keep dev server running
npm run dev

# Terminal 2: Create owner account
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test-owner@bodyfittraining.com",
    "password":"TestPassword123!"
  }'
```

**Expected Results:**
- [ ] Response status: 201 Created
- [ ] Response includes user ID (UUID)
- [ ] Response includes email
- [ ] Response includes profile with role='owner'
- [ ] Check Supabase:
  - [ ] auth.users table has new user
  - [ ] profiles table has new row with role='owner'
  - [ ] User created_at timestamp is recent

#### 8. Owner Account Errors Test
```bash
# Missing email
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{"password":"Test123"}'

# Duplicate email (if second attempt with same email)
# Weak password
```

**Expected Results:**
- [ ] Missing field → 400 error with descriptive message
- [ ] Duplicate email → 400 error from Supabase
- [ ] Weak password → 400 error from auth
- [ ] Error messages are helpful but don't leak sensitive data

#### 9. Client Account Creation Test
```bash
# First: Create owner account (done above)
# Then: Create client account with phone from leads

curl -X POST http://localhost:3000/api/auth/client \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"9876543210",
    "email":"test-client@example.com",
    "password":"TestPassword123!",
    "name":"John Doe",
    "is_pt_client":true
  }'
```

**Expected Results:**
- [ ] Response status: 201 Created
- [ ] Response includes user ID
- [ ] Response includes profile with role='client'
- [ ] Check Supabase:
  - [ ] New user in auth.users
  - [ ] New profile with role='client'
  - [ ] is_pt_client = true

#### 10. RLS Security Test (Database Level)
```bash
# This requires Supabase Auth access
# In Supabase SQL Editor, test:

-- Logged in as CLIENT (user: abc123)
SELECT * FROM profiles;
-- Should return: Only user's profile (abc123)

SELECT * FROM profiles WHERE id != 'abc123';
-- Should return: ERROR or empty (no access to other profiles)

SELECT * FROM memberships;
-- Should return: Only user's memberships

SELECT * FROM leads;
-- Should return: Empty or error (clients can't see leads)

-- Logged in as OWNER (user: owner123)
SELECT * FROM profiles;
-- Should return: ALL profiles (no RLS filter)

SELECT * FROM leads;
-- Should return: ALL leads
```

**Expected Results:**
- [ ] Clients see only their data
- [ ] Owner sees all data
- [ ] No accidental data leaks
- [ ] RLS policies properly enforced

---

## 🔧 Type & Lint Checking

### TypeScript Type Checking
```bash
# Check for type errors (no build needed)
npx tsc --noEmit

# Expected: 0 errors
```

### ESLint Linting
```bash
# Check code quality
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Build Verification
```bash
# Full production build (tests everything)
npm run build

# Expected:
# ✓ Compiled successfully
# ✓ No errors or warnings
# ✓ Created optimized production build
```

---

## 📱 Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

**Test Points:**
- Page loads without errors
- Modal opens/closes properly
- Phone input works
- Submit button responsive
- Form validation works

### Mobile Browsers
- [ ] Safari iOS (Latest)
- [ ] Chrome Android (Latest)
- [ ] Firefox Android (Latest)

**Test Points:**
- Responsive layout
- Touch inputs work (phone number)
- Modal not distorted on small screens
- Keyboard doesn't cover submit button

---

## 🚀 Deployment to Vercel

### Prerequisites
- GitHub account with repository pushed
- Vercel account (free tier OK)
- Supabase project with schema executed

### Step 1: Prepare GitHub Repository
```bash
# Verify all files committed
git status

# Should show: "nothing to commit, working tree clean"

# If changes exist:
git add .
git commit -m "Body Fit Training - Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Find your GitHub repository for "Body Fit Training"
5. Click "Import"

### Step 3: Configure Environment Variables
1. In Vercel, go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environment: Production, Preview, Development

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development

NEXT_PUBLIC_WHATSAPP_NUMBER
Value: 919876543210
Environment: Production, Preview, Development
```

> **Important:** Get these values from Supabase Dashboard → Settings → API

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-5 minutes for build to complete
3. Once complete, click "Visit" to see your live site

**Expected Result:**
- Live URL: `https://your-project-name.vercel.app`
- Landing page loads with hero + memberships
- Phone capture modal works
- Leads save to Supabase (check database)

### Step 5: Post-Deployment Verification
```bash
# Test live site (replace with your Vercel URL)
curl https://your-project-name.vercel.app/

# Should return HTML (not error)

# Test API endpoint
curl -X POST https://your-project-name.vercel.app/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'

# Should return: Same response as local testing
```

---

## 🐛 Debugging Tips

### Common Issues & Solutions

#### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
npm install @supabase/supabase-js
npm run dev
```

#### Issue: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solution:**
- Create `.env.local` file
- Copy from `.env.example`
- Fill in actual Supabase URLs/keys
- Restart dev server: `npm run dev`

#### Issue: "Phone capture not saving to database"
**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for JavaScript errors (red X)
4. Go to Network tab
5. Click "Get Started" button
6. Watch network requests
7. Should see POST to `/api/auth/...` with 201 status
8. If not, check:
   - `.env.local` has correct Supabase URLs
   - RLS policies applied in Supabase (check SQL Editor)
   - `leads` table exists (Dashboard → Tables)

#### Issue: "Owner account creation fails with 500 error"
**Solution:**
- Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- Verify key is correct (from Supabase Settings → API)
- Check browser console for specific error
- Try again with different email address

#### Issue: "Type errors in VS Code"
**Solution:**
```bash
npm install
npx tsc --noEmit
```

### Enable Debug Mode (Development)
```bash
# In .env.local, add:
DEBUG=*

# Or specifically for Supabase:
DEBUG=supabase:*

# Then run:
npm run dev
```

---

## 📊 Performance Testing

### Lighthouse Audit
```bash
# Build for production
npm run build

# Start production server
npm start

# In Chrome Browser:
# F12 → Lighthouse tab → Generate report
```

**Target Scores:**
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

### Load Testing (Future - When more users come)
At 100+ concurrent users, consider:
- Database connection pooling
- Redis caching layer
- CDN optimization
- Database indexing review

---

## 📋 Pre-Launch Checklist

### Code Quality
- [ ] TypeScript: `npx tsc --noEmit` passes
- [ ] Linting: `npm run lint` passes
- [ ] Build: `npm run build` succeeds
- [ ] No console errors in browser (F12)

### Functionality
- [ ] Landing page loads correctly
- [ ] Phone capture modal works
- [ ] Valid phones submit successfully
- [ ] Leads appear in Supabase database
- [ ] Owner account endpoint works
- [ ] RLS policies enforced

### Security
- [ ] No hardcoded secrets in code
- [ ] `.env.local` NOT committed to Git
- [ ] Service role key only in server code
- [ ] HTTPS enabled on Vercel (automatic)
- [ ] RLS policies verified in Supabase

### Deployment
- [ ] GitHub repository ready
- [ ] Vercel project configured
- [ ] Environment variables set
- [ ] Domain configured (optional)
- [ ] Vercel build succeeds
- [ ] Live site works end-to-end

### Documentation
- [ ] README.md complete
- [ ] SETUP_GUIDE.md complete
- [ ] ARCHITECTURE.md complete
- [ ] QUICK_REFERENCE.md complete
- [ ] This file:TESTING_DEPLOYMENT.md complete

---

## 🎯 Next Phase (After Launch)

### Phase 2 Tasks
1. **Client Dashboard**
   - Membership card with QR code
   - Progress vault (charts + photos)
   - WhatsApp chat widget

2. **Admin Dashboard**
   - Client management table
   - Expiry tracker with color-coding
   - Bulk messaging interface

3. **Authentication**
   - OTP login flow
   - Email verification
   - Password reset

4. **Integrations**
   - WhatsApp API (automated reminders)
   - Payment gateway (Razorpay/Stripe)
   - Photo storage (Supabase Storage)

---

## 📞 Support & Troubleshooting Resources

- **Vercel Status**: https://www.vercel.com/status
- **Supabase Status**: https://status.supabase.com
- **GitHub Status**: https://www.githubstatus.com
- **Stack Overflow Tags**: `next.js` `supabase` `vercel`

---

**Last Updated: April 14, 2026**
