# Body Fit Training - Complete Setup Guide

## 🎯 Project Initialization Complete ✅

Your **Body Fit Training** full-stack web application has been successfully scaffolded with all required components. Here's what's been created:

---

## 📦 Deliverables Completed

### ✅ 1. Next.js Frontend Scaffold
- Modern Next.js 14 with TypeScript
- App Router architecture with `src/` directory structure
- Tailwind CSS with custom military-industrial color palette
- Landing page with hero section and membership tier cards
- Phone capture modal for lead generation

**Files Created:**
- `src/app/layout.tsx` - Root layout with global styles
- `src/app/page.tsx` - Landing page with membership tiers
- `src/app/globals.css` - Global styles & custom utility classes
- `src/components/PhoneCaptureModal.tsx` - Lead capture form
- `tailwind.config.ts` - Theme configuration

### ✅ 2. Supabase Database Schema (`supabase_schema.sql`)

Four production-ready tables with Row Level Security:

#### Tables Created:
1. **leads** - Phone captures for lead generation
2. **profiles** - User profiles with RBAC (Owner/Client roles)
3. **memberships** - Membership tracking with expiry dates
4. **progress** - Weight, body fat, photo progress tracking

#### RLS Policies Implemented:
- **Leads**: Public insert (pre-auth), Owner-only read
- **Profiles**: Users view/edit own, Owner views all
- **Memberships**: Users view own, Owner manages all
- **Progress**: Users manage own, Owner views all

#### Helper Functions:
- `get_days_until_expiry(user_id)` - Calculate membership expiry
- `get_expiring_memberships_48h()` - Find expiring memberships for WhatsApp reminders

### ✅ 3. Authentication API Routes

#### `POST /api/auth/owner` - Create Admin Account
```bash
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{"email":"vikram@bodyfittraining.com","password":"SecurePassword123!"}'
```

#### `POST /api/auth/client` - Create Client Account
```bash
curl -X POST http://localhost:3000/api/auth/client \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"9876543210",
    "email":"client@example.com",
    "password":"SecurePassword123!",
    "name":"John Doe",
    "is_pt_client":true
  }'
```

### ✅ 4. Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies: Supabase, React, Next, Tailwind |
| `tsconfig.json` | TypeScript strict mode + path aliases |
| `next.config.js` | Next.js optimization settings |
| `tailwind.config.ts` | Custom theme (Tactical Black, Slate Grey, Forest Green) |
| `postcss.config.js` | PostCSS with Tailwind support |
| `.eslintrc.json` | ESLint from Next.js defaults |
| `.env.example` | Environment variable template |
| `.gitignore` | Git ignore patterns |

### ✅ 5. Type Definitions
- `src/lib/supabase.ts` - Supabase client + TypeScript types for all database tables

---

## 🚀 Next Steps to Launch

### Step 1: Install Node.js (if not available)
Your system currently doesn't have Node.js installed. You have two options:

**Option A: Use Homebrew** (Recommended)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

**Option B: Download from nodejs.org**
Visit https://nodejs.org and install the Latest LTS version

After installation:
```bash
node --version   # Should show v18 or higher
npm --version    # Should show 9 or higher
```

### Step 2: Install Dependencies
```bash
cd "project gym"
npm install
```
This will install all required packages (Next.js, Supabase, Tailwind, etc.)

### Step 3: Setup Supabase Project

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Sign up or log in
   - Click "New Project"
   - Fill in project details and create

2. **Execute Database Schema**
   - In Supabase Dashboard, go to **SQL Editor**
   - Create new query and paste contents of `supabase_schema.sql`
   - Click "Run" to execute
   - Verify all tables and policies are created

3. **Get API Keys**
   - Go to **Settings** → **API**
   - Copy these values:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Create Environment File
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
```env
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your business info
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_COACH_NAME=Vikram Valecha

# Optional: WhatsApp API integration
WHATSAPP_API_TOKEN=your-token-from-meta
WHATSAPP_PHONE_ID=your-phone-id
```

### Step 5: Create Owner Account
```bash
npm run dev
```

Then in a new terminal:
```bash
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{"email":"vikram@bodyfittraining.com","password":"ChangeMe123!"}'
```

Response should show:
```json
{
  "message": "Owner account created successfully",
  "user": { "id": "...", "email": "..." },
  "profile": { "id": "...", "role": "owner" }
}
```

### Step 6: Test Landing Page
- Open http://localhost:3000
- You should see:
  - Hero section: "Transform with CERTAINTY"
  - Membership tier cards (1/3/6 months)
  - "Get Started" button opens phone capture modal
- Submit a phone number (test: 9876543210)
- Verify lead is stored in Supabase: Dashboard → **leads** table

---

## 🎨 Design System Overview

### Colors
```
Tactical Black:  #1A1C1E  (Primary background)
Slate Grey:      #2F353B  (Secondary)
Forest Green:    #3B4D3C  (Accent - Energy)
```

### Typography
- Font: System fonts (Inter, Segoe UI, Roboto)
- Sans-serif stack for cross-platform consistency

### Components
- **Buttons**: `.btn-tactical` class (Forest Green with hover effects)
- **Borders**: `.tactical-border` (2px Forest Green)
- **Shadows**: `.tactical-shadow` (deep drop shadows)

---

## 📊 Database Schema Reference

### Leads Table (Lead Generation)
```sql
id (UUID)
phone (VARCHAR 10)
timestamp (TIMESTAMP)  -- Auto-filled with NOW()
```

### Profiles Table (User Accounts)
```sql
id (UUID, FK to auth.users)
name (VARCHAR 255)
email (VARCHAR 255, UNIQUE)
age (INTEGER)
role ('owner' | 'client')
is_pt_client (BOOLEAN)
created_at, updated_at (TIMESTAMP)
```

### Memberships Table (Pricing & Expiry)
```sql
id (UUID)
user_id (UUID, FK to profiles)
package_type ('1month' | '3months' | '6months')
  Prices: ₹1,200 | ₹3,400 | ₹7,000
start_date (DATE)
expiry_date (DATE)
payment_status ('pending' | 'completed' | 'failed')
created_at, updated_at (TIMESTAMP)
```

### Progress Table (Transformation Tracking)
```sql
id (UUID)
user_id (UUID, FK to profiles)
weight (DECIMAL 5,2)  -- kg
body_fat (DECIMAL 5,2)  -- percentage
photo_url (VARCHAR 512)  -- Cloud storage URL
date (DATE)
created_at, updated_at (TIMESTAMP)
```

---

## 🔐 Row Level Security (RLS) Explained

### What is RLS?
Row Level Security restricts which database rows users can access based on their role and user ID.

### Current Policies:

**Leads Table:**
- Anyone can INSERT (pre-authentication lead capture)
- Only Owner can SELECT (view all leads)

**Profiles Table:**
- Users can SELECT/UPDATE their own profile (where id = auth.uid())
- Owner can SELECT all profiles

**Memberships Table:**
- Users can SELECT only their memberships
- Owner can SELECT/CREATE all memberships

**Progress Table:**
- Users can SELECT/INSERT/UPDATE only their own progress
- Owner can SELECT all progress

### Benefits:
✅ No need for manual permission checks in code  
✅ Database enforces security at the row level  
✅ Prevents accidental data leaks  
✅ Scales with app growth

---

## 🔌 API Integration Points

### Supabase Auth Integration
The app uses Supabase Auth for:
- Email/password authentication
- Custom user metadata (role: 'owner' or 'client')
- JWT tokens for API authorization

### WhatsApp Integration (Future)
Two integration points:
1. **Click-to-Chat**: Pre-filled message linking to WhatsApp
2. **Automated Reminders**: Edge Function calls WhatsApp API for expiry alerts

---

## 📱 Frontend Components Overview

### Landing Page (`src/app/page.tsx`)
- Hero section with military-industrial branding
- Membership tier cards with pricing
- "Get Started" CTA button
- Links to login (future)

### Phone Capture Modal (`src/components/PhoneCaptureModal.tsx`)
- Phone number input with validation (10 digits only)
- Stores lead in Supabase
- Error handling and success message
- Automatic redirect to `/auth/login` on success

### Future Components (To Be Built)
- Client Dashboard: Membership card, QR check-in, Progress vault
- Admin Dashboard: Client list, expiry tracker, color-coded alerts
- Progress Charts: Sparkline charts for weight/body fat trends
- WhatsApp Chat widget: Floating button with pre-filled message

---

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial Body Fit Training setup"
git push origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Environment Variables
Click "Environment Variables" and add:
```
NEXT_PUBLIC_SUPABASE_URL = https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
NEXT_PUBLIC_WHATSAPP_NUMBER = 919876...
```

### Step 4: Deploy
Click "Deploy" and Vercel will:
- Build your Next.js app
- Run type checking
- Deploy to global CDN
- Provide production URL

---

## ✨ Key Features Implemented

| Feature | Status | Location |
|---------|--------|----------|
| Next.js Setup | ✅ Complete | `src/app/`, `package.json` |
| Tailwind CSS | ✅ Complete | `tailwind.config.ts` |
| Supabase Schema | ✅ Complete | `supabase_schema.sql` |
| RLS Policies | ✅ Complete | `supabase_schema.sql` |
| Landing Page | ✅ Complete | `src/app/page.tsx` |
| Phone Capture Modal | ✅ Complete | `src/components/PhoneCaptureModal.tsx` |
| Auth Routes | ✅ Complete | `src/app/api/auth/` |
| Environment Setup | ✅ Complete | `.env.example` |
| API Client | ✅ Complete | `src/lib/supabase.ts` |
| Documentation | ✅ Complete | `README.md`, `.github/copilot-instructions.md` |

---

## 🔍 Troubleshooting Guide

### Issue: "npm: command not found"
**Solution:** Install Node.js (see Step 1 above)

### Issue: "Cannot connect to Supabase"
**Solution:**
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check .env.local has the right values
- Ensure Supabase project is active

### Issue: "Phone capture modal not storing data"
**Solution:**
- Check Supabase RLS policies are applied
- Verify `leads` table exists: Dashboard → Tables
- Check browser console for errors (F12)

### Issue: "Owner account creation fails"
**Solution:**
- Ensure SUPABASE_SERVICE_ROLE_KEY is in .env.local
- Check the email/password meet requirements
- Verify `profiles` table has correct schema

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org
- **Vercel Docs**: https://vercel.com/docs

---

## ✅ Verification Checklist

Use this checklist to verify your setup:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created at supabase.com
- [ ] Database schema executed (`supabase_schema.sql`)
- [ ] `.env.local` configured with Supabase keys
- [ ] Dev server runs (`npm run dev`)
- [ ] Landing page loads at http://localhost:3000
- [ ] Phone capture modal works
- [ ] Phone submissions appear in Supabase → leads table
- [ ] Owner account created successfully
- [ ] Type checking passes (`npx tsc --noEmit`)

---

## 🎯 Next Features to Build

After completing the setup verification, consider adding:

1. **Client Dashboard**
   - Display active membership with expiry countdown
   - QR code for check-in
   - Progress vault with charts

2. **Admin Dashboard**
   - List all clients with status
   - Expiry tracker with color-coding (Red < 3 days)
   - Bulk messaging interface

3. **Authentication Pages**
   - OTP login (`/auth/login`)
   - Email verification
   - Password reset

4. **WhatsApp Integration**
   - Floating chat button
   - Automated expiry reminders (Edge Function)

5. **Payment Integration**
   - Razorpay or Stripe checkout
   - Invoice generation
   - Payment history

---

## 📞 Support

For questions during setup:
1. Check README.md for command reference
2. Review `.github/copilot-instructions.md` for troubleshooting
3. Check Supabase documentation
4. Refer to Next.js docs for framework questions

---

**Congratulations! Your Body Fit Training application is ready for development. 🎉**
