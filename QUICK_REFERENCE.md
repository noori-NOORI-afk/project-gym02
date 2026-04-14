# Body Fit Training - Quick Reference

## 🚀 First-Time Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Add Supabase credentials to .env.local
# (Get from https://supabase.com → Settings → API)

# 4. Start dev server
npm run dev

# 5. Create owner account (in new terminal)
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{"email":"vikram@bodyfittraining.com","password":"ChangeMe123!"}'
```

Visit **http://localhost:3000** → You should see the landing page with hero and membership tiers.

---

## 📂 Project Structure at a Glance

```
project gym/
├── README.md                      # Comprehensive documentation
├── SETUP_GUIDE.md                 # Detailed setup instructions ← START HERE
├── .github/
│   └── copilot-instructions.md    # Copilot development guidelines
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page (hero + memberships)
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global + theme styles
│   │   └── api/auth/
│   │       ├── owner/route.ts     # POST /api/auth/owner
│   │       └── client/route.ts    # POST /api/auth/client
│   ├── components/
│   │   └── PhoneCaptureModal.tsx   # Lead capture modal
│   └── lib/
│       └── supabase.ts            # Supabase client + types
├── supabase_schema.sql            # Database + RLS policies
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tailwind.config.ts             # Theme (colors, fonts)
└── tsconfig.json                  # TypeScript config
```

---

## 🗂️ Database Tables

### leads
- Pre-authentication phone captures
- Any role can INSERT (public lead capture)
- Only Owner can SELECT

### profiles
- User accounts with roles (owner/client)
- Users see own, Owner sees all

### memberships
- Pricing tiers: 1 Month (₹1,200), 3 Months (₹3,400), 6 Months (₹7,000)
- Tracks expiry dates for notifications

### progress
- Weight, body fat, photo tracking
- Users manage own only

---

## 🎨 Tailwind Colors

```
Tactical Black:  #1A1C1E  (Primary bg)
Slate Grey:      #2F353B  (Secondary)
Forest Green:    #3B4D3C  (Accent)
```

**Custom Utilities:**
- `.btn-tactical` - Forest green button with hover effects
- `.tactical-border` - 2px forest green border
- `.tactical-shadow` - Deep drop shadow

---

## 📡 API Endpoints

### POST /api/auth/owner
Create admin account. **Requires SUPABASE_SERVICE_ROLE_KEY in .env.local**

```bash
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"SecurePass123!"}'
```

### POST /api/auth/client
Create client account. **Must use phone from leads table**

```bash
curl -X POST http://localhost:3000/api/auth/client \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"9876543210",
    "email":"user@example.com",
    "password":"SecurePass123!",
    "name":"John Doe",
    "is_pt_client":true
  }'
```

---

## 🔧 Common Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Check code quality
npx tsc --noEmit     # Type check
npm test             # Run tests (when added)
```

---

## ⚙️ Environment Variables

**Required for Dev:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Optional:**
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_COACH_NAME=Vikram Valecha
WHATSAPP_API_TOKEN=your-token
WHATSAPP_PHONE_ID=your-phone-id
```

---

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com
- **Vercel Dashboard**: https://vercel.com
- **GitHub Repository**: [Your repo URL]
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs

---

## ❌ Troubleshooting

**"npm: command not found"**
→ Install Node.js: `brew install node`

**"Cannot connect to Supabase"**
→ Check .env.local has correct NEXT_PUBLIC_SUPABASE_URL

**"Phone capture not saving"**
→ Check `leads` table exists in Supabase dashboard

**"Owner account creation fails"**
→ Verify SUPABASE_SERVICE_ROLE_KEY in .env.local

---

## 📋 Feature Checklist

- [x] Next.js 14 + TypeScript + Tailwind setup
- [x] Landing page with hero + membership tiers
- [x] Phone capture modal
- [x] Supabase schema + RLS policies
- [x] Auth API routes (owner/client)
- [ ] Client dashboard (membership card, QR, progress)
- [ ] Admin dashboard (client list, expiry tracker)
- [ ] WhatsApp integration (click-to-chat + reminders)
- [ ] OTP login flow
- [ ] Payment integration (Razorpay/Stripe)

---

## 🎯 Next Steps After Setup

1. **Test the flow**: Submit phone → See lead in Supabase
2. **Deploy to Vercel**: Push to GitHub, import in Vercel, add env vars
3. **Build client dashboard**: Membership card + QR check-in
4. **Build admin dashboard**: Client list + expiry alerts
5. **Add WhatsApp integration**: Chat button + reminders

---

**Last Updated: April 14, 2026**
