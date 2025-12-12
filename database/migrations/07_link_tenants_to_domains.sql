-- =====================================================
-- 7. TENANT DOMAIN LINKING (Reverse Link)
-- =====================================================

-- Add primary_domain_id to tenants to link back to verified_domains
-- This makes verified_domains the source of truth for the actual domain record
ALTER TABLE tenants
ADD COLUMN IF NOT EXISTS primary_domain_id INTEGER;

-- Add Foreign Key Constraint
ALTER TABLE tenants
    ADD CONSTRAINT fk_tenants_primary_domain
    FOREIGN KEY (primary_domain_id)
    REFERENCES verified_domains (id)
    ON DELETE SET NULL; -- If domain is deleted, tenant just loses the primary pointer, not the account

-- Create Index for performance
CREATE INDEX IF NOT EXISTS idx_tenants_primary_domain ON tenants(primary_domain_id);

-- Optional: Comments to discourage usage of legacy columns in future
COMMENT ON COLUMN tenants.domain IS 'DEPRECATED: Use verified_domains table or primary_domain_id instead';
COMMENT ON COLUMN tenants.subdomain IS 'DEPRECATED: Use verified_domains table or primary_domain_id instead';
