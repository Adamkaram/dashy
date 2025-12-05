const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Migrating products table...");
        await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price INTEGER DEFAULT 0;`);
        await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;`);
        console.log("Migration successful.");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await pool.end();
    }
}

migrate();
