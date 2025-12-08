
import { query } from '../lib/db';

async function main() {
    try {
        console.log('Adding missing columns to hero_slides...');

        await query(`
            ALTER TABLE hero_slides 
            ADD COLUMN IF NOT EXISTS subtitle_color VARCHAR(50) DEFAULT '#FFFFFF',
            ADD COLUMN IF NOT EXISTS title_color VARCHAR(50) DEFAULT '#FFFFFF';
        `);

        console.log('Migration completed successfully.');

        // Reload schema cache
        await query("NOTIFY pgrst, 'reload config'");
        console.log('Schema cache reload notified.');

        process.exit(0);
    } catch (error) {
        console.error('Error migrating hero_slides:', error);
        process.exit(1);
    }
}

main();
