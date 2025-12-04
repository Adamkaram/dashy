
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    try {
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'orders';
    `);

        if (res.rows.length > 0) {
            console.log("Orders table exists.");

            // Check columns
            const cols = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'orders';
      `);
            console.log("Columns:", cols.rows.map(r => `${r.column_name} (${r.data_type})`));

        } else {
            console.log("Orders table DOES NOT exist.");
        }
    } catch (err) {
        console.error("Error querying DB:", err);
    } finally {
        await client.end();
    }
}

main();
