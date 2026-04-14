-- ============================================================================
-- BODY FIT TRAINING - SUPABASE DATABASE SCHEMA
-- ============================================================================

-- ============================================================================
-- 1. LEADS TABLE (Pre-authentication phone captures)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(10) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast phone lookups
CREATE INDEX IF NOT EXISTS leads_phone_idx ON public.leads(phone);

-- ============================================================================
-- 2. PROFILES TABLE (User profiles with RBAC)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  age INTEGER,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('owner', 'client')),
  is_pt_client BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- ============================================================================
-- 3. MEMBERSHIPS TABLE (Tracks active memberships)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_type VARCHAR(20) NOT NULL CHECK (package_type IN ('1month', '3months', '6months')),
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for membership queries
CREATE INDEX IF NOT EXISTS memberships_user_id_idx ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS memberships_expiry_idx ON public.memberships(expiry_date);

-- ============================================================================
-- 4. PROGRESS TABLE (Weight, body fat, and photo tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight DECIMAL(5, 2),
  body_fat DECIMAL(5, 2),
  photo_url VARCHAR(512),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for progress queries
CREATE INDEX IF NOT EXISTS progress_user_id_idx ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS progress_date_idx ON public.progress(date);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- *** LEADS TABLE - Public insert only (no authentication) ***
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Leads are only visible to authenticated users (owner)" ON public.leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- *** PROFILES TABLE ***
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT
  USING (id = auth.uid());

-- Owner can see all profiles
CREATE POLICY "Owner can view all profiles" ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- *** MEMBERSHIPS TABLE ***
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Users can see their own memberships
CREATE POLICY "Users can view their own memberships" ON public.memberships
  FOR SELECT
  USING (user_id = auth.uid());

-- Owner can see all memberships
CREATE POLICY "Owner can view all memberships" ON public.memberships
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- Owner can manage memberships
CREATE POLICY "Owner can create memberships" ON public.memberships
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Owner can update memberships" ON public.memberships
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- *** PROGRESS TABLE ***
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Users can see their own progress
CREATE POLICY "Users can view their own progress" ON public.progress
  FOR SELECT
  USING (user_id = auth.uid());

-- Owner can see all progress
CREATE POLICY "Owner can view all progress" ON public.progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress" ON public.progress
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own progress
CREATE POLICY "Users can update their own progress" ON public.progress
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Function to get days until membership expiry
CREATE OR REPLACE FUNCTION get_days_until_expiry(user_id UUID)
RETURNS INTEGER AS $$
  SELECT CAST(expiry_date - CURRENT_DATE AS INTEGER)
  FROM public.memberships
  WHERE user_id = $1
  ORDER BY expiry_date DESC
  LIMIT 1;
$$ LANGUAGE SQL;

-- Function to find memberships expiring in 48 hours
CREATE OR REPLACE FUNCTION get_expiring_memberships_48h()
RETURNS TABLE(user_id UUID, email VARCHAR, phone VARCHAR, days_left INTEGER) AS $$
  SELECT 
    m.user_id,
    p.email,
    l.phone,
    CAST(m.expiry_date - CURRENT_DATE AS INTEGER)
  FROM public.memberships m
  JOIN public.profiles p ON m.user_id = p.id
  LEFT JOIN public.leads l ON p.email = l.phone
  WHERE m.expiry_date between CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days'
  AND m.payment_status = 'completed';
$$ LANGUAGE SQL;
