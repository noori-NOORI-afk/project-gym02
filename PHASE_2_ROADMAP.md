# Body Fit Training - Phase 2+ Development Roadmap

## Current Status: Phase 1 ✅ COMPLETE

Your MVP (Minimum Viable Product) is complete and ready for local development or deployment to Vercel.

---

## 🗓️ Phase 2: Client & Admin Dashboards (4-6 weeks)

### Client Dashboard Pages

#### `/dashboard` - Main Dashboard
**Purpose:** Clients see at-a-glance status after login

**Components to Build:**
1. **Membership Card**
   - Current membership status (Active/Expired/Expiring)
   - Days remaining (countdown timer)
   - Package type (1/3/6 months)
   - QR code for check-in
   - Renew button

2. **Quick Stats**
   - Last weight recorded
   - Last body fat %
   - Check-in count this month
   - Latest photo date

3. **Call-to-Action**
   - WhatsApp chat button (pre-filled message)
   - Renew membership button
   - View progress vault button

**Database Queries Needed:**
```sql
-- Get active membership for user
SELECT * FROM memberships 
WHERE user_id = auth.uid() 
AND expiry_date >= NOW()
ORDER BY expiry_date DESC
LIMIT 1;

-- Get latest progress entries
SELECT * FROM progress
WHERE user_id = auth.uid()
ORDER BY date DESC
LIMIT 10;
```

#### `/dashboard/progress` - Progress Vault
**Purpose:** Track and visualize transformation

**Components to Build:**
1. **Weight Tracker Chart**
   - Sparkline or line chart
   - Day-by-day weight entries
   - Average weight calculation
   - Target weight setting

2. **Body Fat % Chart**
   - Similar to weight chart
   - Show progress over time
   - Calculate monthly improvement

3. **Photo Gallery**
   - Upload progress photos
   - Before/after comparisons
   - Date-based timeline view
   - Pinned favorite shots

4. **Stats Summary**
   - Total weight lost/gained
   - Total body fat lost
   - Days since start
   - Projected goal date

**New Database Table Needed:**
```sql
-- Might need to extend progress table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add photo-specific fields if needed
ALTER TABLE progress ADD COLUMN photo_tags VARCHAR[];
ALTER TABLE progress ADD COLUMN is_public BOOLEAN DEFAULT false;
```

**Libraries to Add:**
```json
{
  "dependencies": {
    "recharts": "^2.10.0",        // Charts
    "react-dropzone": "^14.2.0"   // Photo upload
  }
}
```

### Admin Dashboard Pages

#### `/admin` - Admin Dashboard
**Purpose:** Vikram Valecha's control center

**Components to Build:**
1. **Overview Stats**
   - Total active members
   - Total revenue (this month/year)
   - Members expiring this week
   - New members this month

2. **Expiry Tracker Table**
   - All members with expiry dates
   - Color-coded status:
     - 🔴 Red: < 3 days (URGENT)
     - 🟡 Yellow: 3-7 days (SOON)
     - 🟢 Green: > 7 days (OK)
   - Quick actions: Send WhatsApp, Extend, Cancel

3. **Member Management**
   - Search/filter by name, email, status
   - View member details
   - Edit membership (extend, downgrade, upgrade)
   - Send bulk messages

4. **Create New Member**
   - Manually add client if lead missed
   - Assign membership package
   - Send welcome message

**Database Queries Needed:**
```sql
-- Get expiring memberships (already exists)
SELECT * FROM get_expiring_memberships_48h();

-- Get all members with status
SELECT 
  p.id, 
  p.name, 
  p.email,
  m.expiry_date,
  CAST(m.expiry_date - CURRENT_DATE AS INTEGER) as days_left,
  m.package_type,
  m.payment_status
FROM profiles p
LEFT JOIN memberships m ON p.id = m.user_id
WHERE p.role = 'client'
ORDER BY m.expiry_date ASC;

-- Get revenue report
SELECT 
  DATE_TRUNC('month', m.created_at) as month,
  COUNT(*) as new_members,
  SUM(CASE 
    WHEN m.package_type = '1month' THEN 1200
    WHEN m.package_type = '3months' THEN 3400
    WHEN m.package_type = '6months' THEN 7000
  END) as revenue
FROM memberships m
WHERE m.payment_status = 'completed'
GROUP BY DATE_TRUNC('month', m.created_at)
ORDER BY month DESC;
```

#### `/admin/bulk-messaging` - Bulk WhatsApp
**Purpose:** Send messages to multiple clients

**Components to Build:**
1. **Message Template**
   - Select predefined templates
   - Custom message editor
   - Preview with variables (Name, Days Left, etc.)

2. **Recipient Selection**
   - Filter by: Status, Package Type, Join Date
   - Manual selection checkbox
   - Count: "Send to X members"

3. **Send Confirmation**
   - Preview message
   - Final confirmation
   - Success notification

**Note:** Requires WhatsApp API integration (Phase 3)

---

## 🔌 Phase 3: Integrations (4-6 weeks)

### WhatsApp Integration

#### 1. Click-to-Chat Button (Frontend)
**Already Partially Done:**
- Add floating button to `/dashboard`
- Pre-filled message: "Coach, I'm logged in and have a question..."
- Open WhatsApp with link: `https://wa.me/919876543210?text=...`

**Code Template:**
```typescript
// src/components/WhatsAppButton.tsx
export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(
    "Coach, I'm logged into the portal and have a question regarding my transformation."
  );
  
  return (
    <a 
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full"
    >
      💬
    </a>
  );
}
```

#### 2. Automated Expiry Reminders (Edge Function)
**Purpose:** Send WhatsApp reminders 48 hours before expiry

**Create Supabase Edge Function:**
```typescript
// supabase/functions/send-expiry-reminders/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get expiring memberships
  const { data: expiringMembers } = await supabase.rpc(
    "get_expiring_memberships_48h"
  );

  for (const member of expiringMembers || []) {
    // Send WhatsApp message
    const response = await fetch("https://graph.instagram.com/v18.0/...", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("WHATSAPP_API_TOKEN")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: member.phone,
        type: "template",
        template: {
          name: "membership_expiry_reminder",
          language: { code: "en" },
          parameters: {
            body: {
              parameters: [
                { type: "text", text: member.email },
                { type: "text", text: member.days_left.toString() },
              ],
            },
          },
        },
      }),
    });
  }

  return new Response(JSON.stringify({ success: true }));
});
```

**Deploy:**
```bash
supabase functions deploy send-expiry-reminders --project-id your-project
```

**Schedule (in Supabase Dashboard):**
- Cron: `0 9 * * *` (9 AM UTC daily)

#### 3. Template-Based Messaging
**Option:** Use WhatsApp Business API templates instead of custom messages
- Pre-approve message templates
- Faster sending with templates
- Better delivery rates

---

### Payment Gateway Integration (Phase 3)

#### Razorpay Integration
**Steps:**
1. Add Razorpay SDK to frontend
2. Create `/api/payments/create-order` endpoint
3. Handle payment webhook
4. Create/update membership on successful payment

**Code Skeleton:**
```typescript
// src/app/api/payments/create-order/route.ts
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  const { amount, packageType, userId } = await request.json();

  // Create order
  const order = await razorpay.orders.create({
    amount: amount * 100, // In paise
    currency: "INR",
    receipt: `membership-${userId}`,
  });

  // Store order in database
  // Redirect to payment UI
  return Response.json(order);
}
```

#### Alternative: Stripe
- Similar flow but uses different API
- Better for international payments
- Slightly higher fees

---

## 🎯 Phase 4: Advanced Features (6-12 weeks)

### Analytics & Reporting
- Member growth charts
- Revenue trends
- Most popular packages
- Retention metrics
- Churn rate analysis

### Mobile App (React Native)
- QR check-in
- Progress photos on-the-go
- Push notifications
- Offline functionality (cache)

### AI-Powered Features (Future)
- AI nutrition recommendations
- Automated workout plans based on progress
- Chatbot for common questions
- Transformation predictions

### Community Features
- Member profiles (if public)
- Success story wall
- Leaderboards (optional)
- Group challenges

---

## 📋 Development Checklist for Phase 2

### Authentication & Authorization
- [ ] OTP login flow (via Supabase Auth)
- [ ] Email verification
- [ ] Password reset
- [ ] Session management
- [ ] Logout functionality

### Client Dashboard
- [ ] Build layout/navigation
- [ ] Membership card component
- [ ] QR code generator (qrcode.react already in package.json)
- [ ] Progress charts (add recharts)
- [ ] Photo upload functionality
- [ ] WhatsApp chat button

### Admin Dashboard
- [ ] Build admin layout
- [ ] Member list table with filtering
- [ ] Expiry tracker with color-coding
- [ ] Quick action buttons
- [ ] Create member form
- [ ] Bulk messaging interface

### Database
- [ ] Add photo metadata columns to progress table
- [ ] Add notification_sent flag to memberships
- [ ] Add check-in tracking table
- [ ] Add payment tracking table

### Testing
- [ ] Unit tests for components
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows
- [ ] Mobile responsiveness testing

---

## 📦 Recommended Packages for Phase 2

Add to `package.json`:
```json
{
  "dependencies": {
    "recharts": "^2.10.0",              // Charts for progress
    "react-dropzone": "^14.2.0",        // File/photo upload
    "qrcode.react": "^1.0.1",           // QR code (already added)
    "@hookform/resolvers": "^3.3.0",    // Form validation
    "react-hook-form": "^7.45.0",       // Form management
    "date-fns": "^2.30.0",              // Date formatting
    "zustand": "^4.4.0"                 // State management (optional)
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest": "^29.7.0"
  }
}
```

---

## 🚀 Estimated Timelines

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| **Phase 1 (✅ Done)** | 2 weeks | Landing page + Database + Auth |
| **Phase 2** | 4-6 weeks | Dashboards (Client + Admin) |
| **Phase 3** | 4-6 weeks | Payments + WhatsApp Integration |
| **Phase 4** | 6-12 weeks | Analytics + Mobile App |

---

## 🎯 Success Metrics (Phase 2)

After Phase 2 completion:
- ✅ Users can log in and see their dashboard
- ✅ Progress vault records and displays weight/body fat trends
- ✅ Admin can manage all clients
- ✅ Expiry alerts are visible in admin dashboard
- ✅ Mobile-responsive design passes all devices
- ✅ No critical bugs or console errors

---

## 🔗 Getting Started with Phase 2

1. **Start with Authentication**
   - Implement OTP login flow
   - Add password reset
   - Create session management

2. **Build Client Dashboard**
   - Create layout and navigation
   - Add membership card
   - Build progress tracking UI

3. **Build Admin Dashboard**
   - Create admin layout
   - Add client list/table
   - Add expiry tracker

4. **Connect Everything**
   - Wire up data flows
   - Test RLS policies
   - End-to-end testing

---

For more information:
- See `ARCHITECTURE.md` for system design
- See `README.md` for project overview
- See `QUICK_REFERENCE.md` for commands and links

---

**Phase 2 Development can begin immediately after Phase 1 setup verification.**
