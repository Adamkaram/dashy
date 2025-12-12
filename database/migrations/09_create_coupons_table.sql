CREATE TABLE IF NOT EXISTS "coupons" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" varchar(50) NOT NULL UNIQUE,
    "discount_type" varchar(20) NOT NULL, -- 'percentage' or 'fixed'
    "discount_value" decimal(10, 2) NOT NULL,
    "start_date" timestamp DEFAULT now(),
    "end_date" timestamp,
    "usage_limit" integer,
    "usage_count" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "tenant_id" uuid REFERENCES "tenants"("id") ON DELETE CASCADE,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "coupons_code_idx" ON "coupons" ("code");
CREATE INDEX IF NOT EXISTS "coupons_tenant_id_idx" ON "coupons" ("tenant_id");
