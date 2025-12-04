-- =====================================================
-- 3. THEMES SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'custom',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    preview_image TEXT,
    demo_url TEXT,
    config JSONB NOT NULL DEFAULT '{}', -- Default configuration tokens
    created_by UUID REFERENCES tenants(id) ON DELETE SET NULL,
    version VARCHAR(20) DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS theme_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    customizations JSONB DEFAULT '{}',
    layout_config JSONB DEFAULT '{}',
    active_sections JSONB DEFAULT '[]',
    section_order JSONB DEFAULT '[]',
    custom_css TEXT,
    custom_js TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, theme_id)
);

-- Add Foreign Key for Active Theme to Tenants table
ALTER TABLE tenants 
    ADD CONSTRAINT fk_tenants_active_theme 
    FOREIGN KEY (active_theme_id) 
    REFERENCES themes(id) 
    ON DELETE SET NULL;

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
