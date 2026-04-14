# Body Fit Training - Project Setup & Development Guidelines

## Project Overview

This is a full-stack web application for **Body Fit Training**, a premium fitness coaching platform. The stack includes:
- **Frontend**: Next.js 14 (TypeScript, Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Deployment**: Vercel
- **Version Control**: GitHub

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
- Create a project at [supabase.com](https://supabase.com)
- In SQL Editor, execute the contents of `supabase_schema.sql`
- Copy API keys to `.env.local` (see .env.example)

### 3. Create Owner Account
```bash
curl -X POST http://localhost:3000/api/auth/owner \
  -H "Content-Type: application/json" \
  -d '{"email":"vikram@bodyfittraining.com","password":"YourSecurePassword"}'
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── owner/route.ts          # Owner account creation
│   │   └── client/route.ts         # Client account creation
│   ├── globals.css                 # Military-industrial theme
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page with lead capture
├── components/
│   └── PhoneCaptureModal.tsx        # Phone capture form
└── lib/
    └── supabase.ts                 # Supabase client

Database Schema: supabase_schema.sql
- Tables: leads, profiles, memberships, progress
- RLS: Role-based access (Owner vs Client)
```

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server on http://localhost:3000 |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check |

## Environment Variables

Create `.env.local` from `.env.example` and configure:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=...
```

## Database Setup

1. Execute `supabase_schema.sql` in Supabase SQL Editor
2. Creates 4 tables: leads, profiles, memberships, progress
3. Implements Row Level Security (RLS):
   - **Leads**: Public insert, Owner-only read
   - **Profiles**: Users see own, Owner sees all
   - **Memberships**: Users see own, Owner manages all
   - **Progress**: Users manage own, Owner views all

## API Endpoints

### Owner Account Creation
```
POST /api/auth/owner
Body: { email, password }
```

### Client Account Creation
```
POST /api/auth/client
Body: { phone, email, password, name, is_pt_client }
```

## Deployment to Vercel

1. Push to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables (from .env.local)
4. Deploy

## Design System

### Colors (Military-Industrial Aesthetic)
- **Tactical Black**: #1A1C1E
- **Slate Grey**: #2F353B
- **Forest Green**: #3B4D3C (Accent)

### Branding
- Founder: Vikram Valecha (20+ years)
- Positioning: Transformation/Certainty, not gym access

## Key Features

✅ Pre-login phone capture → Lead storage  
✅ OTP-based authentication  
✅ RBAC with custom JWT claims  
✅ Membership (1/3/6 months)  
✅ Progress tracking (weight, body fat, photos)  
✅ WhatsApp integration  
✅ Admin dashboard with expiry tracking  
✅ QR check-in system  

## Troubleshooting

### Node/npm Not Found
```bash
# Install Node.js using Homebrew
brew install node
npm --version  # Verify
```

### Supabase Connection Error
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env.local
- Check Supabase project status at supabase.com

### RLS Policy Issues
- Review `supabase_schema.sql` for correct RLS policies
- Test policies: Dashboard → Auth → RLS Inspector

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Docs](https://vercel.com/docs)

## Support

For questions or issues, refer to:
- **README.md**: Comprehensive project guide
- **supabase_schema.sql**: Database structure & RLS
- **src/api/auth**: Route implementations

---

Last Updated: April 14, 2026
