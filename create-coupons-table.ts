import { Client } from "pg";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    try {
        console.log("Creating coupons table...");

        const sql = `
-- Create coupons table
CREATE TABLE IF NOT EXISTS "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"discount_type" text NOT NULL,
	"discount_value" integer NOT NULL,
	"min_order_amount" integer DEFAULT 0,
	"max_discount_amount" integer,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"user_usage_limit" integer DEFAULT 1,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);

-- Create coupon_usage table to track individual usage
CREATE TABLE IF NOT EXISTS "coupon_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_id" uuid NOT NULL,
	"user_id" text,
	"order_id" uuid,
	"discount_amount" integer NOT NULL,
	"used_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coupon_usage_coupon_id_coupons_id_fk') THEN
        ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_coupon_id_coupons_id_fk" 
        FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "coupons_code_idx" ON "coupons" USING btree ("code");
CREATE INDEX IF NOT EXISTS "coupons_valid_from_idx" ON "coupons" USING btree ("valid_from");
CREATE INDEX IF NOT EXISTS "coupons_valid_until_idx" ON "coupons" USING btree ("valid_until");
CREATE INDEX IF NOT EXISTS "coupons_is_active_idx" ON "coupons" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "coupon_usage_coupon_id_idx" ON "coupon_usage" USING btree ("coupon_id");
CREATE INDEX IF NOT EXISTS "coupon_usage_user_id_idx" ON "coupon_usage" USING btree ("user_id");
    `;

        await client.query(sql);
        console.log("✅ Coupons table created successfully!");

        // Verify
        const check = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'coupons'
      );
    `);
        console.log("Table exists:", check.rows[0].exists);

    } catch (err: any) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

main();
