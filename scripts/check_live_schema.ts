import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    try {
        const tables = ['coupons', 'hero_slides', 'products', 'orders'];

        for (const table of tables) {
            console.log(`\n--- Schema for table: ${table} ---`);
            const exists = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                );
            `, [table]);

            if (!exists.rows[0].exists) {
                console.log(`Table ${table} does NOT exist.`);
                continue;
            }

            const cols = await client.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = $1 
                AND table_schema = 'public'
                ORDER BY ordinal_position;
            `, [table]);

            console.table(cols.rows);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

main();
