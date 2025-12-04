-- Create coupons table
CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"discount_type" text NOT NULL, -- 'percentage' or 'fixed'
	"discount_value" integer NOT NULL, -- percentage (0-100) or fixed amount in fils
	"min_order_amount" integer DEFAULT 0, -- minimum order amount in fils
	"max_discount_amount" integer, -- maximum discount cap in fils (for percentage discounts)
	"usage_limit" integer, -- total number of times coupon can be used (null = unlimited)
	"usage_count" integer DEFAULT 0 NOT NULL, -- current usage count
	"user_usage_limit" integer DEFAULT 1, -- times a single user can use this coupon
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint

-- Create coupon_usage table to track individual usage
CREATE TABLE "coupon_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_id" uuid NOT NULL,
	"user_id" text,
	"order_id" uuid,
	"discount_amount" integer NOT NULL, -- actual discount applied in fils
	"used_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Add foreign key constraints
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

-- Create indexes for better query performance
CREATE INDEX "coupons_code_idx" ON "coupons" USING btree ("code");
--> statement-breakpoint
CREATE INDEX "coupons_valid_from_idx" ON "coupons" USING btree ("valid_from");
--> statement-breakpoint
CREATE INDEX "coupons_valid_until_idx" ON "coupons" USING btree ("valid_until");
--> statement-breakpoint
CREATE INDEX "coupons_is_active_idx" ON "coupons" USING btree ("is_active");
--> statement-breakpoint
CREATE INDEX "coupon_usage_coupon_id_idx" ON "coupon_usage" USING btree ("coupon_id");
--> statement-breakpoint
CREATE INDEX "coupon_usage_user_id_idx" ON "coupon_usage" USING btree ("user_id");
