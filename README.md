# Body Fit Training - Full-Stack Web Application

A premium fitness management platform built with **Next.js**, **Supabase**, and **Vercel**, designed to deliver transformation and certainty to fitness clients.

## 🎯 Overview

**Body Fit Training** is a full-stack web application that combines:
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with Role-Based Access Control (RBAC)
- **Deployment**: Vercel
- **Version Control**: GitHub

### Key Features

✅ **Pre-login Lead Capture**: Phone number modal before authentication  
✅ **RBAC System**: Owner (Admin) and Client (Member) roles  
✅ **Membership Management**: 1/3/6-month pricing tiers with expiry tracking  
✅ **Progress Vault**: Weight, body fat charts, and private photo uploads  
✅ **WhatsApp Integration**: Click-to-chat and automated expiry reminders  
✅ **Admin Dashboard**: Manage clients, track expiry dates with color-coding  
✅ **QR Check-in**: Membership card with QR code verification  

---

## 🏗️ Project Structure

```
project gym/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── owner/route.ts       # Owner account creation
│   │   │       └── client/route.ts      # Client account creation
│   │   ├── globals.css                  # Global styles & military-industrial theme
│   │   ├── layout.tsx                   # Root layout
│   │   └── page.tsx                     # Landing page with phone capture
│   ├── components/
│   │   └── PhoneCaptureModal.tsx         # Lead capture modal
│   └── lib/
│       └── supabase.ts                  # Supabase client & type definitions
├── supabase_schema.sql                  # Database schema & RLS policies
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript configuration
├── tailwind.config.ts                   # Tailwind theme (military-industrial)
├── next.config.js                       # Next.js configuration
└── .env.example                         # Environment variables template
```

---

## 🎨 Design System

### Color Palette (Military-Industrial Aesthetic)
- **Tactical Black**: `#1A1C1E` (Primary background)
- **Slate Grey**: `#2F353B` (Secondary)
- **Forest Green**: `#3B4D3C` (Accent - Energy)

### Branding
- **Founder**: Vikram Valecha (20+ years competitive fitness)
- **Positioning**: Selling "Certainty/Output" (Transformation), not just gym access

---

## 🗄️ Database Schema

### Tables

#### 1. **leads**
Pre-authentication phone captures for lead generation.
```sql
- id (UUID, Primary Key)
- phone (VARCHAR 10)
- timestamp (TIMESTAMP)
```

#### 2. **profiles**
User profiles with RBAC.
```sql
- id (UUID, FK to auth.users, Primary Key)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- age (INTEGER)
- role (VARCHAR 20: 'owner' | 'client')
- is_pt_client (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### 3. **memberships**
Active membership tracking with pricing tiers.
```sql
- id (UUID, Primary Key)
- user_id (UUID, FK to profiles.id)
- package_type (VARCHAR 20: '1month' | '3months' | '6months')
- start_date (DATE)
- expiry_date (DATE)
- payment_status (VARCHAR 20: 'pending' | 'completed' | 'failed')
- created_at, updated_at (TIMESTAMP)

Pricing:
  - 1 Month: ₹1,200
  - 3 Months: ₹3,400
  - 6 Months: ₹7,000
```

#### 4. **progress**
Weight, body fat, and photo progress tracking.
```sql
- id (UUID, Primary Key)
- user_id (UUID, FK to profiles.id)
- weight (DECIMAL 5,2)
- body_fat (DECIMAL 5,2)
- photo_url (VARCHAR 512)
- date (DATE)
- created_at, updated_at (TIMESTAMP)
```

### Row Level Security (RLS)

| Table | Owner Access | Client Access |
|-------|--------------|---------------|
| **leads** | ✅ View all | ❌ None |
| **profiles** | ✅ View/Edit all | ✅ View/Edit own |
| **memberships** | ✅ Create/View/Edit all | ✅ View own |
| **progress** | ✅ View all | ✅ Insert/View/Edit own |

---

## ⚙️ Environment Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account + project
- GitHub repository
- Vercel account

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd "project gym"
npm install
```

### 2. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → Create New Query
3. Copy contents of `supabase_schema.sql` and execute to create tables & RLS
4. Go to **Settings** → **API** to get:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Create `.env.local`

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_APP_NAME=Body Fit Training
NEXT_PUBLIC_COACH_NAME=Vikram Valecha
NEXT_PUBLIC_WHATSAPP_NUMBER=your-whatsapp-number

WHATSAPP_API_TOKEN=your-whatsapp-api-token
WHATSAPP_PHONE_ID=your-whatsapp-phone-id
```

### 4. Create Owner Account

```bash
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vikram@bodyfittraining.com",
    "password": "SecurePassword123!"
  }'
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔐 API Endpoints

### Authentication Routes

#### `POST /api/auth/owner`
Create an Owner (Admin) account.

**Request:**
```json
{
  "email": "vikram@bodyfittraining.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "message": "Owner account created successfully",
  "user": { "id": "uuid", "email": "..." },
  "profile": { "id": "uuid", "role": "owner", ... }
}
```

---

#### `POST /api/auth/client`
Create a Client (Member) account from a lead.

**Request:**
```json
{
  "phone": "9876543210",
  "email": "client@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "is_pt_client": true
}
```

**Response (201):**
```json
{
  "message": "Client account created successfully",
  "user": { "id": "uuid", "email": "..." },
  "profile": { "id": "uuid", "role": "client", ... }
}
```

---

## 📱 Frontend Features

### Landing Page (`/`)
- Hero section with military-industrial aesthetic
- Phone capture modal with validation
- Membership tier cards (1/3/6 months with pricing)
- Navigation with Login & Get Started CTA

### Phone Capture Modal
- Collects 10-digit phone number
- Stores lead in `leads` table
- Redirects to OTP login after submission
- Error handling with user feedback

### Future Views
- **Client Dashboard**: Membership card, progress vault, WhatsApp chat
- **Admin Dashboard**: Client management, expiry tracker, color-coded alerts
- **Progress Vault**: Sparkline charts, photo gallery
- **QR Check-in**: Mobile-optimized membership verification

---

## 🚀 Deployment to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial Body Fit Training setup"
git push origin main
```

2. Visit [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables (same as `.env.local`)
4. Deploy

---

## 🤖 Automation: WhatsApp Expiry Reminders

### Supabase Edge Function (Cron Job)

Create a new Edge Function to send WhatsApp reminders for expiring memberships:

```typescript
// supabase/functions/send-expiry-reminders/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: expiringMembers } = await supabase
    .rpc("get_expiring_memberships_48h")

  for (const member of expiringMembers) {
    // Send WhatsApp message via API
    const message = `Hi ${member.email}, your membership expires in ${member.days_left} days! Renew now to continue your transformation.`
    // Call WhatsApp API...
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

**Deploy:**
```bash
supabase functions deploy send-expiry-reminders --project-id your-project
```

**Schedule Cron:**
- Go to **Supabase Dashboard** → **Functions** → **send-expiry-reminders**
- Set schedule to run daily at 9:00 AM UTC

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:3000)
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 📋 Checklist for Production

- [ ] Supabase credentials configured in Vercel
- [ ] RLS policies verified in Supabase
- [ ] Owner account created and tested
- [ ] Client registration flow tested end-to-end
- [ ] WhatsApp API credentials configured
- [ ] Edge Function deployed and scheduled
- [ ] Domain configured (e.g., bodyfittraining.com)
- [ ] SSL certificate enabled
- [ ] Monitoring & analytics set up
- [ ] Backup strategy configured in Supabase

---

## 📞 Support & Contact

- **Coach**: Vikram Valecha
- **Platform**: Body Fit Training
- **Email**: support@bodyfittraining.com
- **WhatsApp**: [Your WhatsApp Number]

---

## 📄 License

© 2026 Body Fit Training. All rights reserved.
