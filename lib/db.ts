import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export const db = drizzle(pool, { schema });

// Helper for raw queries on tables not in Drizzle schema
export async function query(text: string, params?: any[]) {
    return pool.query(text, params);
}
