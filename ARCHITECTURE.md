# Body Fit Training - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL (Deployment)                     │
│                        (CDN + Serverless)                       │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 (Frontend + API)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pages                                                    │  │
│  │ • Landng: Hero + Memberships + Phone Capture Modal     │  │
│  │ • Dashboard: Client view (future)                      │  │
│  │ • Admin: Owner view (future)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Routes                                               │  │
│  │ • POST /api/auth/owner   (Create admin account)        │  │
│  │ • POST /api/auth/client  (Create client account)       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Components                                               │  │
│  │ • PhoneCaptureModal (Lead generation)                  │  │
│  │ • MembershipCard (future)                              │  │
│  │ • ProgressChart (future)                               │  │
│  │ • AdminTable (future)                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Styling: Tailwind CSS + Custom Theme                   │  │
│  │ • Colors: Tactical Black, Slate Grey, Forest Green     │  │
│  │ • Responsive: Mobile-first design                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (Supabase JS Client)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE (Backend + Database)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Authentication (Supabase Auth)                           │  │
│  │ • Email/Password                                         │  │
│  │ • OTP (future)                                           │  │
│  │ • Custom JWT Claims (role: owner/client)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database (RLS Enabled)                        │  │
│  │                                                          │  │
│  │  leads              profiles           memberships       │  │
│  │  ├─ id              ├─ id              ├─ id             │  │
│  │  ├─ phone           ├─ email           ├─ user_id        │  │
│  │  └─ timestamp       ├─ role (owner/    ├─ package_type   │  │
│  │                     │    client)       ├─ start_date     │  │
│  │                     ├─ is_pt_client    ├─ expiry_date    │  │
│  │                     └─ ...             └─ payment_status │  │
│  │                                                          │  │
│  │  progress                                                │  │
│  │  ├─ id                                                   │  │
│  │  ├─ user_id                                              │  │
│  │  ├─ weight                                               │  │
│  │  ├─ body_fat                                             │  │
│  │  ├─ photo_url                                            │  │
│  │  └─ date                                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Row Level Security (RLS)                                 │  │
│  │ • leads: Public INSERT, Owner-only SELECT              │  │
│  │ • profiles: Users see own, Owner sees all               │  │
│  │ • memberships: Users see own, Owner sees all            │  │
│  │ • progress: Users manage own, Owner views all           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Helper Functions / Edge Functions (future)               │  │
│  │ • get_days_until_expiry()                                │  │
│  │ • get_expiring_memberships_48h()                         │  │
│  │ • send_whatsapp_reminder()  [Cron Job]                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                              ↓ (Optional)
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ WhatsApp API (Meta)                                      │  │
│  │ • Send expiry reminders (via Edge Function              │  │
│  │ • Pre-filled chat links (frontend)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Payment Gateway (future)                                 │  │
│  │ • Razorpay or Stripe                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Cloud Storage (future)                                   │  │
│  │ • Supabase Storage for progress photos                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      VERSION CONTROL                            │
│                    GITHUB (Main Repository)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 1. Lead Capture Flow (Pre-Authentication)

```
User visits landing page (/)
         ↓
See hero + membership tiers
         ↓
Click "Get Started" button
         ↓
Phone Capture Modal opens
         ↓
User enters 10-digit phone number
         ↓
Click "Continue to OTP Login"
         ↓
[PhoneCaptureModal.tsx]
  validatePhone() → backend INSERT
         ↓
POST request to Supabase
         ↓
[supabase_schema.sql]
  INSERT INTO leads (phone, timestamp)
  VALUES (user_input, NOW())
         ↓
Lead stored in leads table
         ↓
Show success message
         ↓
Redirect to /auth/login (future)
```

### 2. Owner Account Creation Flow

```
Admin wants to set up owner account
         ↓
Terminal: curl -X POST /api/auth/owner
  Body: { email, password }
         ↓
[src/app/api/auth/owner/route.ts]
  1. Validate email/password
  2. Create auth user with role='owner'
  3. Insert profile with role='owner'
         ↓
[Supabase Auth]
  Create user record
  Set custom metadata: { role: 'owner' }
         ↓
[Supabase Database]
  INSERT INTO profiles (id, email, role, ...)
         ↓
RLS Policy Allows (admin has role='owner')
         ↓
Profile created successfully
         ↓
Return success response
```

### 3. Client Account Creation Flow

```
Lead clicks login from modal
         ↓
Redirected to /auth/client (future)
         ↓
User enters: email, password, name, is_pt_client
         ↓
POST /api/auth/client
  Body: { phone, email, password, name, is_pt_client }
         ↓
[src/app/api/auth/client/route.ts]
  1. Verify phone exists in leads table
  2. Create auth user with role='client'
  3. Insert profile with role='client'
         ↓
[Supabase Auth]
  Create user record
  Set custom metadata: { role: 'client', phone }
         ↓
[Supabase Database]
  INSERT INTO profiles (id, email, role, name, ...)
         ↓
RLS Policy Allows (user owns their profile)
         ↓
Profile created successfully
         ↓
Return success response + redirect to dashboard
```

### 4. Membership & Progress Access Flow

```
CLIENT attempts to view membership data
         ↓
Client ID: abc123
         ↓
SELECT * FROM memberships
  WHERE user_id = auth.uid()
         ↓
[RLS Policy Check]
  WHERE user_id = auth.uid() ✓ (Client owns data)
         ↓
Return client's memberships only
         ↓
────────────────────────────────────────
         ↓
OWNER attempts to view membership data
         ↓
Owner ID: owner123
         ↓
SELECT * FROM memberships
  WHERE user_id = ANY(all_user_ids)
         ↓
[RLS Policy Check]
  1. Check if auth.uid() = owner123
  2. Check if role='owner' in profiles
  ✓ Both true
         ↓
Return ALL memberships (no filter)
         ↓
────────────────────────────────────────
         ↓
ATTACKER attempts to access other user data
         ↓
SELECT * FROM progress
  WHERE user_id = 'victim_user_id'
         ↓
[RLS Policy Check]
  WHERE user_id = auth.uid()
  ❌ user_id != auth.uid()
         ↓
Query returns ZERO rows (no error)
         ↓
Data remains secure
```

### 5. Expiry Reminder Flow (Cron Job - Future)

```
Daily at 9:00 AM UTC
         ↓
Supabase Edge Function triggered
  [supabase/functions/send-expiry-reminders/index.ts]
         ↓
Call helper function:
  get_expiring_memberships_48h()
         ↓
Query returns memberships expiring in 48 hours:
  {
    user_id: ...,
    email: ...,
    phone: ...,
    days_left: 2
  }
         ↓
For each expiring membership:
  1. Fetch user phone from profiles
  2. Build WhatsApp message
  3. Call WhatsApp API
  4. Log result to database
         ↓
WhatsApp message sent to user:
  "Hi John, your membership expires in 2 days!
   Renew now to continue your transformation.
   [Renewal Link]"
         ↓
Update membership notification_sent = true
         ↓
Cron job complete
```

---

## 🔄 Component Hierarchy

```
Layout (src/app/layout.tsx)
  └─ Page / (src/app/page.tsx)
     ├─ Navigation
     ├─ Hero Section
     ├─ Membership Tier Cards
     └─ PhoneCaptureModal
        ├─ Close Button
        ├─ Input Field (phone)
        ├─ Submit Button
        └─ Error/Success Message

Future Dashboard Structure:
─────────────────────────────

AppLayout
  ├─ Header / Navbar
  │   ├─ Logo / Brand
  │   ├─ Nav Links
  │   └─ User Menu
  │
  ├─ Sidebar (Admin only)
  │   ├─ Dashboard Link
  │   ├─ Clients Link
  │   ├─ Reports Link
  │   └─ Settings Link
  │
  └─ Main Content
     ├─ [CLIENT DASHBOARD]
     │   ├─ MembershipCard
     │   │   ├─ QR Code
     │   │   ├─ Status
     │   │   └─ Expiry Countdown
     │   ├─ ProgressVault
     │   │   ├─ WeightChart (Sparkline)
     │   │   ├─ BodyFatChart (Sparkline)
     │   │   └─ PhotoGallery
     │   └─ WhatsAppWidget (Floating Button)
     │
     └─ [ADMIN DASHBOARD]
         ├─ ClientList (Table)
         │   ├─ Name
         │   ├─ Membership Status
         │   ├─ Expiry Date
         │   └─ Action Buttons
         ├─ ExpiryTracker (Color-coded)
         │   ├─ Red (< 3 days)
         │   ├─ Yellow (3-7 days)
         │   └─ Green (> 7 days)
         ├─ SendMessage (Bulk WhatsApp)
         └─ Reports (Charts + Analytics)
```

---

## 🔐 Authentication Flow (Current + Future)

```
CURRENT (Phase 1):
─────────────────
1. User visits landing page
2. Phone capture modal
3. Lead stored in database
4. Future: Redirect to OTP login (not yet built)

PHASE 2 (Next):
───────────────
1. User submits phone (already built)
2. Supabase Auth sends OTP via SMS/Email
3. User enters OTP
4. Backend verifies OTP
5. Create account from lead data
6. Issue JWT token
7. User logged in → Dashboard

PHASE 3 (Optional Enhancement):
───────────────────────────────
• Google/Apple OAuth login
• 2FA (Two-Factor Authentication)
• Social login integrations
```

---

## 🛡️ Security Layers

```
Layer 1: Frontend Validation
  └─ Phone number format (10 digits)
  └─ Email validation
  └─ Password strength check

Layer 2: API Route Validation
  └─ Supabase Service Role Key (server-side only)
  └─ Input sanitization
  └─ Error messages (generic, no data leaks)

Layer 3: Database Level (RLS)
  └─ Row-level security policies
  └─ Role-based access control
  └─ Column-level encryption (optional future)

Layer 4: Application Logic
  └─ Supabase Auth JWT verification
  └─ Custom role claims in token
  └─ Session management

Layer 5: Infrastructure
  └─ HTTPS/TLS for all communications
  └─ Environment variables (never in client code)
  └─ Vercel DDoS protection
  └─ Supabase firewall rules
```

---

## 📈 Scalability Considerations

### Current Architecture (MVP):
- ✅ Handles 100-1000 concurrent users
- ✅ PostgreSQL auto-scales with Supabase
- ✅ Vercel serverless auto-scales
- ✅ Tailwind CSS minimal bundle size (~15KB gzip)

### When to Optimize (1000+ users):
- Add caching layer: Redis via Supabase Extensions
- Implement search: Full-text search in PostgreSQL
- Add CDN: Supabase CDN for static assets
- Optimize images: Next.js Image component with optimization
- Monitor analytics: Sentry for error tracking

---

## 🔌 API Integration Points

| Integration | Purpose | Status |
|-------------|---------|--------|
| Supabase Auth | User authentication | ✅ Ready |
| Supabase Database | Data persistence | ✅ Ready |
| Supabase Storage | Photo uploads | 🔄 Future |
| WhatsApp API | Notifications + Chat | 🔄 Future |
| Razorpay | Payment processing | 🔄 Future |
| Vercel Analytics | Performance monitoring | 🔄 Future |
| Sentry | Error tracking | 🔄 Future |

---

## 🎯 Development Roadmap

### Sprint 1 (Current - Complete ✅)
- [x] Next.js scaffold with Tailwind
- [x] Landing page + phone capture
- [x] Supabase schema + RLS
- [x] Auth API routes
- [x] Documentation

### Sprint 2 (Next)
- [ ] Client dashboard (membership card + QR)
- [ ] Admin dashboard (client list + expiry tracker)
- [ ] OTP login flow
- [ ] Email verification

### Sprint 3
- [ ] Progress vault (charts + photos)
- [ ] WhatsApp integration (click-to-chat)
- [ ] Automated expiry reminders (Edge Function)

### Sprint 4
- [ ] Payment gateway integration
- [ ] Invoice generation
- [ ] Analytics & reporting

### Sprint 5
- [ ] Mobile app (React Native optional)
- [ ] Advanced features (AI coach, meal plans)
- [ ] Community features

---

**Last Updated: April 14, 2026**
