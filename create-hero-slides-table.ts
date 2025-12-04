import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    try {
        console.log("Creating hero_slides table...");

        const sql = `
-- Create hero_slides table
CREATE TABLE IF NOT EXISTS "hero_slides" (
  "id" SERIAL PRIMARY KEY,
  "tenant_id" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  "image" text NOT NULL,
  "title" text NOT NULL,
  "subtitle" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "hero_slides_tenant_id_idx" ON "hero_slides" ("tenant_id");
CREATE INDEX IF NOT EXISTS "hero_slides_display_order_idx" ON "hero_slides" ("display_order");
CREATE INDEX IF NOT EXISTS "hero_slides_is_active_idx" ON "hero_slides" ("is_active");
    `;

        await client.query(sql);
        console.log("✅ hero_slides table created successfully!");

        // Verify
        const check = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hero_slides'
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
