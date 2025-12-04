import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    try {
        // Check if table exists
        const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'coupons'
      );
    `);
        console.log("Table exists:", tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            // Get columns
            const cols = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'coupons' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
            console.log("\nColumns:");
            console.table(cols.rows);

            // Try a test insert
            console.log("\nAttempting test insert...");
            try {
                const result = await client.query(`
          INSERT INTO coupons (
            code, 
            discount_type, 
            discount_value, 
            min_order_amount,
            valid_from,
            valid_until,
            is_active
          ) VALUES (
            'TEST123',
            'percentage',
            10,
            0,
            NOW(),
            NOW() + INTERVAL '30 days',
            true
          ) RETURNING *;
        `);
                console.log("Insert successful:", result.rows[0]);

                // Clean up
                await client.query(`DELETE FROM coupons WHERE code = 'TEST123'`);
            } catch (insertErr: any) {
                console.error("Insert failed:", insertErr.message);
                console.error("Detail:", insertErr.detail);
            }
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

main();
