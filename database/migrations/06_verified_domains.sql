-- =====================================================
-- 6. VERIFIED DOMAINS (Domain Management)
-- =====================================================

CREATE TABLE IF NOT EXISTS verified_domains (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changed from UUID to TEXT to match 'user' table
  tenant_id UUID,        -- Changed from TEXT to UUID to match 'tenants' table
  domain TEXT NOT NULL UNIQUE, -- Full domain (e.g., tenant1.app.com)
  domain_type TEXT NOT NULL, -- 'subdomain' or 'custom'
  verification_token TEXT,   -- Token for verification
  verified BOOLEAN DEFAULT FALSE, -- Verification status
  verified_at TIMESTAMP WITH TIME ZONE,
  ssl_status TEXT DEFAULT 'pending_verification', -- SSL status
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foreign Key Constraints
ALTER TABLE verified_domains
    ADD CONSTRAINT fk_tenant
    FOREIGN KEY (tenant_id)
    REFERENCES tenants (id)
    ON DELETE CASCADE;

-- Note: 'user' table is quoted because it's a reserved keyword in Postgres if used without quotes in some contexts, 
-- but usually safe to reference as "user". Assuming Auth.js schema.
ALTER TABLE verified_domains
    ADD CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (id); -- Referenced 'user' table explicitly

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_verified_domains_tenant ON verified_domains(tenant_id);
CREATE INDEX IF NOT EXISTS idx_verified_domains_user ON verified_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_verified_domains_domain ON verified_domains(domain);
