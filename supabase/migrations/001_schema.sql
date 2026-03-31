CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USER PROFILES ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    district VARCHAR(50),
    mandal VARCHAR(100),
    role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer', 'admin')),
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CROPS (majorCrop in sample-data.ts)
-- =====================================================

CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL DEFAULT '{"en":"","te":""}',           -- {en: 'Rice', te: 'బియ్యం'}
  crop_type JSONB DEFAULT '{"en":"","te":""}',               -- {en: 'Vegetable', te: 'కూరగాయ'}
  image_url TEXT,                                             -- single image URL
  aliases JSONB DEFAULT '{"en":[],"te":[]}',                 -- {en: ['Tindora'], te: ['తిందోరా']}
  suitable_soil_types JSONB DEFAULT '[]',                      -- [{"type":"red","subType":"clayey"}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CROP VARIETIES (cropVariety in sample-data.ts)
-- Full entity with seasons, districts, characteristics
-- =====================================================

CREATE TABLE crop_varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL DEFAULT '{"en":"","te":""}',           -- {en: 'Kunaram Sannalu', te: '...'}
  major_crop UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  image_url TEXT,
  recommended_seasons JSONB DEFAULT '[]',                     -- [{name:{en,te}, durationInDays:[], months:{en:[],te:[]}}]
  districts TEXT[] DEFAULT '{}',
  grain_character JSONB DEFAULT NULL,                         -- {en: ['Long slender grain'], te: ['...']}
  special_characteristics JSONB DEFAULT '[]',                 -- [{en: '...', te: '...'}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DISEASES (disease in sample-data.ts)
-- All translations stored as JSONB
-- =====================================================

CREATE TABLE diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL DEFAULT '{"en":"","te":""}',           -- {en: 'Powdery Mildew', te: '...'}
  type JSONB DEFAULT '{"en":"","te":""}',                    -- {en: 'Fungal', te: '...'}
  severity TEXT CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  image_urls TEXT[] DEFAULT '{}',                             -- ['url1.jpg', 'url2.jpg']
  symptoms JSONB DEFAULT '[]',                                -- [{en: '...', te: '...'}]
  primary_cause JSONB DEFAULT '{"en":"","te":""}',           -- {en: '...', te: '...'}
  favorable_conditions JSONB DEFAULT '[]',                    -- [{en: '...', te: '...'}]
  preventions JSONB DEFAULT '[]',                             -- [{en: '...', te: '...'}]
  treatments JSONB DEFAULT '[]',                              -- [{en: '...', te: '...'}]
  aliases JSONB DEFAULT '{"en":[],"te":[]}',                 -- {en: ['Oidium'], te: ['ఒయిడియం']}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REMEDIES (remedy in sample-data.ts)
-- All translations stored as JSONB
-- =====================================================

CREATE TABLE remedies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL DEFAULT '{"en":"","te":""}',           -- {en: 'Neem Oil Spray', te: '...'}
  type JSONB DEFAULT '{"en":"","te":""}',                    -- {en: 'Bio-fungicide', te: '...'}
  how_it_works JSONB DEFAULT '{"en":"","te":""}',            -- {en: '...', te: '...'}
  usage_instructions JSONB DEFAULT '[]',                      -- [{en: '...', te: '...'}]
  preparation_instructions JSONB DEFAULT '[]',                -- [{en: '...', te: '...'}]
  ingredients JSONB DEFAULT '[]',                             -- [{en: '...', te: '...'}]
  effectiveness TEXT,                                         -- 'High' | 'Moderate' | 'Low'
  aliases JSONB DEFAULT '{"en":[],"te":[]}',                 -- {en: ['...'], te: ['...']}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- JUNCTION / RELATION TABLES
-- =====================================================

-- disease.cropVarieties ↔ cropVariety.diseases
CREATE TABLE crop_variety_diseases (
  crop_variety_id UUID NOT NULL REFERENCES crop_varieties(id) ON DELETE CASCADE,
  disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
  PRIMARY KEY (crop_variety_id, disease_id)
);

-- disease.remedies ↔ remedy.affectedDiseases
CREATE TABLE disease_remedies (
  disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
  remedy_id UUID NOT NULL REFERENCES remedies(id) ON DELETE CASCADE,
  PRIMARY KEY (disease_id, remedy_id)
);

-- =====================================================
-- HELPER FUNCTION: is_admin()
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- ─── USER PROFILES ──────────────────────────────────

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON user_profiles;
CREATE POLICY "users_select_own"
  ON user_profiles FOR SELECT
  USING (id = auth.uid());

DROP POLICY IF EXISTS "admins_select_all_profiles" ON user_profiles;
CREATE POLICY "admins_select_all_profiles"
  ON user_profiles FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "users_insert_own" ON user_profiles;
CREATE POLICY "users_insert_own"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "users_update_own" ON user_profiles;
CREATE POLICY "users_update_own"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Prevent non-admin users from escalating their own role
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT is_admin() THEN
      RAISE EXCEPTION 'Cannot change own role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_change ON user_profiles;
CREATE TRIGGER trg_prevent_role_change
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

-- ─── CONTENT TABLES: enable RLS ─────────────────────

ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_variety_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_remedies ENABLE ROW LEVEL SECURITY;

-- ─── CONTENT TABLES: public SELECT (authenticated + anon) ───

CREATE POLICY "public_select" ON crops FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "public_select" ON crop_varieties FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "public_select" ON diseases FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "public_select" ON remedies FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "public_select" ON crop_variety_diseases FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "public_select" ON disease_remedies FOR SELECT TO authenticated, anon USING (true);

-- ─── CONTENT TABLES: admin INSERT ───────────────────

CREATE POLICY "admin_insert" ON crops FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "admin_insert" ON crop_varieties FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "admin_insert" ON diseases FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "admin_insert" ON remedies FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "admin_insert" ON crop_variety_diseases FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "admin_insert" ON disease_remedies FOR INSERT TO authenticated WITH CHECK (is_admin());

-- ─── CONTENT TABLES: admin UPDATE ───────────────────

CREATE POLICY "admin_update" ON crops FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_update" ON crop_varieties FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_update" ON diseases FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_update" ON remedies FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_update" ON crop_variety_diseases FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_update" ON disease_remedies FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ─── CONTENT TABLES: admin DELETE ───────────────────

CREATE POLICY "admin_delete" ON crops FOR DELETE TO authenticated USING (is_admin());
CREATE POLICY "admin_delete" ON crop_varieties FOR DELETE TO authenticated USING (is_admin());
CREATE POLICY "admin_delete" ON diseases FOR DELETE TO authenticated USING (is_admin());
CREATE POLICY "admin_delete" ON remedies FOR DELETE TO authenticated USING (is_admin());
CREATE POLICY "admin_delete" ON crop_variety_diseases FOR DELETE TO authenticated USING (is_admin());
CREATE POLICY "admin_delete" ON disease_remedies FOR DELETE TO authenticated USING (is_admin());

-- =====================================================
-- AI SCAN RESULTS (farmer-specific)
-- =====================================================

CREATE TABLE IF NOT EXISTS scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT,
    crop_name TEXT,
    disease_name TEXT,
    severity TEXT CHECK (severity IN ('low', 'moderate', 'high', 'critical', 'none')),
    confidence NUMERIC(5,2),
    result JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON scan_results;
CREATE POLICY "users_select_own" ON scan_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own" ON scan_results;
CREATE POLICY "users_insert_own" ON scan_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own" ON scan_results;
CREATE POLICY "users_delete_own" ON scan_results FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- AI CHAT SESSIONS (farmer-specific)
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Chat',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON chat_sessions;
CREATE POLICY "users_select_own" ON chat_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own" ON chat_sessions;
CREATE POLICY "users_insert_own" ON chat_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own" ON chat_sessions;
CREATE POLICY "users_update_own" ON chat_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own" ON chat_sessions;
CREATE POLICY "users_delete_own" ON chat_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON chat_messages;
CREATE POLICY "users_select_own" ON chat_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM chat_sessions cs WHERE cs.id = session_id AND cs.user_id = auth.uid()));

DROP POLICY IF EXISTS "users_insert_own" ON chat_messages;
CREATE POLICY "users_insert_own" ON chat_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM chat_sessions cs WHERE cs.id = session_id AND cs.user_id = auth.uid()));

DROP POLICY IF EXISTS "users_delete_own" ON chat_messages;
CREATE POLICY "users_delete_own" ON chat_messages FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM chat_sessions cs WHERE cs.id = session_id AND cs.user_id = auth.uid()));

-- =====================================================
-- PREPARATIONS (farmer-specific)
-- Tracks organic remedy batches prepared by each farmer
-- =====================================================

CREATE TABLE IF NOT EXISTS preparations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    remedy_name TEXT,
    quantity TEXT,                                              -- e.g. '5 liters'
    preparation_notes TEXT,
    image_urls TEXT[] DEFAULT '{}',                             -- multiple images
    video_url TEXT,                                             -- single video URL
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE preparations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON preparations;
CREATE POLICY "users_select_own" ON preparations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own" ON preparations;
CREATE POLICY "users_insert_own" ON preparations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own" ON preparations;
CREATE POLICY "users_update_own" ON preparations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own" ON preparations;
CREATE POLICY "users_delete_own" ON preparations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- AUDIT LOGS (security & admin activity tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "admin_select" ON audit_logs FOR SELECT TO authenticated
  USING (is_admin());

-- Any authenticated user can insert (server-side logging via service role bypasses RLS anyway)
CREATE POLICY "authenticated_insert" ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);