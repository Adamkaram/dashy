-- =====================================================
-- Update Tenants Table to Full Schema
-- =====================================================

-- Add missing columns to tenants table if they don't exist
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Ensure default values are set for existing columns if needed
ALTER TABLE tenants 
ALTER COLUMN plan SET DEFAULT 'free',
ALTER COLUMN status SET DEFAULT 'active',
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Verify indexes exist
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);

-- Comment confirming the new shape
COMMENT ON TABLE tenants IS 'Tenants table with full schema including settings and metadata';
