import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    try {
        const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hero_slides'
      );
    `);
        console.log("hero_slides table exists:", tableCheck.rows[0].exists);

        if (tableCheck.rows[0].exists) {
            const count = await client.query(`SELECT count(*) FROM hero_slides;`);
            console.log("Number of slides:", count.rows[0].count);

            const cols = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'hero_slides' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);
            console.log("\nColumns:");
            console.table(cols.rows);
        }

    } catch (err: any) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

main();
