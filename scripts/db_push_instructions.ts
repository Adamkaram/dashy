import { drizzle } from 'drizzle-orm/pg-proxy';
import { migrate } from 'drizzle-orm/pg-proxy/migrator';
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

console.log("To apply schema changes, please run: npx drizzle-kit push");

// Since we are in a dev environment using direct connection string in .env
// The best way is to use the CLI tool provided by drizzle-kit.
