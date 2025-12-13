import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema';

// Check if pgbouncer is in use
const isPgBouncer = process.env.DATABASE_URL?.includes('pgbouncer=true');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    // Connection settings
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Configure Drizzle with prepared statements disabled for pgbouncer
export const db = drizzle(pool, {
    schema,
    logger: process.env.NODE_ENV === 'development',
});

// Helper for raw queries on tables not in Drizzle schema
export async function query(text: string, params?: any[]) {
    return pool.query(text, params);
}
