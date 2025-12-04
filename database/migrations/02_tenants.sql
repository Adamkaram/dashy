-- =====================================================
-- 2. TENANTS (Multi-Tenancy Core)
-- =====================================================

-- Updated At Function (Required for triggers)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identity
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    
    -- Domain Configuration
    domain VARCHAR(255) UNIQUE,
    subdomain VARCHAR(100) UNIQUE,
    
    -- Theme Configuration
    active_theme_id UUID, -- FK added later to avoid circular dependency
    
    -- Subscription & Status
    plan VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'active',
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Settings
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
