import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    try {
        const result = await client.query(`
      SELECT id, slug, name FROM tenants ORDER BY created_at LIMIT 1;
    `);

        if (result.rows.length > 0) {
            console.log("Default tenant found:");
            console.log(result.rows[0]);
        } else {
            console.log("No tenants found. Creating default tenant...");
            const newTenant = await client.query(`
        INSERT INTO tenants (slug, name, subdomain, plan, status, email) 
        VALUES ('default', 'ماى مومنت - الموقع الرئيسي', 'www', 'premium', 'active', 'info@mymoments.com') 
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
        RETURNING id, slug, name;
      `);
            console.log("Created tenant:");
            console.log(newTenant.rows[0]);
        }

    } catch (err: any) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

main();
