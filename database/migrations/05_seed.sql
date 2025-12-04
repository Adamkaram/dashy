-- =====================================================
-- 5. SEED DATA
-- =====================================================

-- 5.1 Default Tenant
INSERT INTO tenants (slug, name, subdomain, plan, status, email) 
VALUES ('default', 'ماى مومنت - الموقع الرئيسي', 'www', 'premium', 'active', 'info@mymoments.com') 
ON CONFLICT (slug) DO NOTHING;

-- 5.2 Theme Registration
-- IMPORTANT: Even though themes are components, we need these records to:
-- 1. Register the theme in the Admin Panel
-- 2. Store default configuration tokens (colors, fonts)
-- 3. Allow tenants to select them

-- Default Theme
INSERT INTO themes (name, slug, description, type, is_public, config, version) 
VALUES (
    'Default Theme - Sarainah',
    'default',
    'الثيم الافتراضي بتصميم سرينا الأنيق',
    'default',
    true,
    '{"colors": {"primary": "#53131C"}, "layout": {"headerHeight": "80px"}}', -- Minimal config, full config in code
    '1.0.0'
) ON CONFLICT (slug) DO NOTHING;

-- Modern Minimal Theme
INSERT INTO themes (name, slug, description, type, is_public, config, version) 
VALUES (
    'Modern Minimal',
    'modern-minimal',
    'ثيم عصري بسيط وأنيق',
    'marketplace',
    true,
    '{"colors": {"primary": "#000000"}, "layout": {"headerHeight": "70px"}}',
    '1.0.0'
) ON CONFLICT (slug) DO NOTHING;

-- Set Active Theme for Default Tenant
UPDATE tenants 
SET active_theme_id = (SELECT id FROM themes WHERE slug = 'default')
WHERE slug = 'default';
