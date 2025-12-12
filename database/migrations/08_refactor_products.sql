-- Refactor products table
-- 1. Add metadata column for flexible attributes
ALTER TABLE products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 2. Drop legacy columns
ALTER TABLE products DROP COLUMN IF EXISTS badge;
ALTER TABLE products DROP COLUMN IF EXISTS provider_name;
ALTER TABLE products DROP COLUMN IF EXISTS provider_logo;
ALTER TABLE products DROP COLUMN IF EXISTS policy;

-- 3. Ensure product_options table is still valid (it is)
