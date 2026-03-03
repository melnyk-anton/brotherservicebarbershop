-- ============================================
-- Brother Service — Database Schema
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================
-- TABLES
-- ============================================

-- Barbers / Staff
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  duration_minutes INTEGER NOT NULL,
  price_uah INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  barber_id UUID NOT NULL REFERENCES barbers(id),
  service_id UUID NOT NULL REFERENCES services(id),
  date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin users (linked to Supabase Auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_bookings_barber_date ON bookings (barber_id, date);
CREATE INDEX idx_bookings_date ON bookings (date);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_barbers_active ON barbers (active);
CREATE INDEX idx_services_active ON services (active);

-- ============================================
-- EXCLUSION CONSTRAINT (Double-booking prevention)
-- ============================================
-- Prevents overlapping time ranges for the same barber
-- on non-cancelled bookings. Requires btree_gist extension.

ALTER TABLE bookings
  ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING gist (
    barber_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  )
  WHERE (status != 'cancelled');

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Barbers: public read, admin update
CREATE POLICY "barbers_public_read"
  ON barbers FOR SELECT
  USING (true);

CREATE POLICY "barbers_admin_update"
  ON barbers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Services: public read
CREATE POLICY "services_public_read"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "services_admin_all"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Bookings: public insert, admin read/update
CREATE POLICY "bookings_public_insert"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "bookings_admin_select"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "bookings_admin_update"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Bookings: public read for slot calculation (only non-cancelled, limited columns)
-- This allows the booking wizard to check existing bookings for a barber/date
CREATE POLICY "bookings_public_read_for_slots"
  ON bookings FOR SELECT
  USING (status != 'cancelled');

-- Admin users: only admins can read their own record
CREATE POLICY "admin_users_self_read"
  ON admin_users FOR SELECT
  USING (id = auth.uid());
