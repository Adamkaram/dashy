
import { query } from '../lib/db';

async function main() {
    try {
        console.log('Reloading PostgREST schema cache...');
        await query("NOTIFY pgrst, 'reload config'");
        console.log('Schema cache reload notified.');

        console.log('Verifying columns in hero_slides...');
        const result = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'hero_slides'
        `);

        console.log('Columns found:', result.rows.map((r: any) => r.column_name).join(', '));

        if (result.rows.some((r: any) => r.column_name === 'subtitle_color')) {
            console.log('SUCCESS: subtitle_color column exists.');
        } else {
            console.error('ERROR: subtitle_color column STILL MISSING!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
