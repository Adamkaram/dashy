-- Create hero_slides table if not exists
CREATE TABLE IF NOT EXISTS hero_slides (
    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tenant_id if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hero_slides' AND column_name='tenant_id') THEN
        ALTER TABLE hero_slides ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update existing rows to have default tenant if tenant_id is null
UPDATE hero_slides SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;

-- Now make it NOT NULL
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM tenants WHERE slug = 'default' LIMIT 1;
    
    IF default_tenant_id IS NOT NULL THEN
        UPDATE hero_slides SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        ALTER TABLE hero_slides ALTER COLUMN tenant_id SET NOT NULL;
    END IF;
END $$;

-- Insert default hero slides
INSERT INTO hero_slides (id, tenant_id, image, title, subtitle, display_order)
SELECT 
    v.id, 
    (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1), 
    v.image, 
    v.title, 
    v.subtitle, 
    v.display_order
FROM (VALUES
    (1, 'https://ext.same-assets.com/2944172014/3656313140.png', 'مرحباً بكم في أرقى الذكريات', 'نجعل لحظاتكم لا تُنسى', 1),
    (2, 'https://ext.same-assets.com/2944172014/270506325.png', 'تصاميم فاخرة', 'لأجمل المناسبات', 2),
    (3, 'https://ext.same-assets.com/2944172014/3529493828.png', 'خدمات متميزة', 'بأعلى معايير الجودة', 3),
    (4, 'https://ext.same-assets.com/2944172014/1804472307.jpeg', 'تنسيق حفلات', 'نحول أحلامكم إلى واقع', 4),
    (5, 'https://ext.same-assets.com/2944172014/4039253469.jpeg', 'باقات ورد', 'لمسات فنية ساحرة', 5)
) AS v(id, image, title, subtitle, display_order)
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_slides_tenant ON hero_slides(tenant_id);

-- Trigger for updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_hero_slides_updated_at') THEN
        CREATE TRIGGER update_hero_slides_updated_at
        BEFORE UPDATE ON hero_slides
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
