-- Migration: Add inventory and product fields to products table
-- Date: 2024-12-12
-- 
-- DESIGN NOTES:
-- - SKU: Unique per tenant (not globally unique) - allows different tenants to use same SKU
-- - quantity on products: For simple products without variants
-- - Variant quantity: Tracked in product_options.options JSONB array
--   Example: [{ label: "أحمر", price: 50, quantity: 10, sku: "SHIRT-RED-M" }]

-- Add new columns to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS brand VARCHAR(100),
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

-- Create unique index for SKU per tenant (partial index - only for non-null SKU)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_tenant_sku 
ON products (tenant_id, sku) 
WHERE sku IS NOT NULL;

-- Create index for brand filtering
CREATE INDEX IF NOT EXISTS idx_products_brand 
ON products (brand) 
WHERE brand IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique per tenant';
COMMENT ON COLUMN products.brand IS 'Product brand name';
COMMENT ON COLUMN products.quantity IS 'Stock quantity for simple products. Variants track qty in product_options.options JSONB';
COMMENT ON COLUMN products.low_stock_threshold IS 'Alert threshold for low stock warning';

-- Example of options JSONB with inventory:
-- [
--   { "label": "أحمر - S", "price": 0, "quantity": 10, "sku": "PROD-RED-S" },
--   { "label": "أحمر - M", "price": 0, "quantity": 15, "sku": "PROD-RED-M" },
--   { "label": "أزرق - S", "price": 50, "quantity": 5, "sku": "PROD-BLUE-S" }
-- ]
