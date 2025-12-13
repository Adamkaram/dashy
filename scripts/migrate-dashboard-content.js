const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Reading migration file...");
        const sqlPath = path.join(__dirname, '../database/migrations/13_dashboard_content.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Executing migration...");
        await pool.query(sql);

        console.log("✅ Migration successful: dashboard_content table created.");
    } catch (e) {
        console.error("❌ Migration failed:", e);
    } finally {
        await pool.end();
    }
}

migrate();
