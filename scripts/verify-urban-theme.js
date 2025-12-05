const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    try {
        console.log('Checking for Urban Vogue theme...');

        // Check if theme exists
        const checkResult = await pool.query(
            "SELECT id, name, slug, is_active FROM themes WHERE slug = 'urban-vogue'"
        );

        if (checkResult.rows.length > 0) {
            console.log('✅ Urban Vogue theme found:', checkResult.rows[0]);
        } else {
            console.log('❌ Urban Vogue theme not found. Inserting...');

            // Insert the theme
            const insertResult = await pool.query(`
                INSERT INTO themes (name, slug, description, is_active, config)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, name, slug, is_active
            `, [
                'Urban Vogue',
                'urban-vogue',
                'A premium, high-fashion theme with dynamic animations inspired by The Stahps.',
                true,
                JSON.stringify({
                    version: '1.0.0',
                    colors: {
                        primary: '#000000',
                        secondary: '#FFFFFF',
                        accent: '#333333',
                        background: '#FFFFFF',
                        foreground: '#000000'
                    },
                    fonts: {
                        heading: 'Inter',
                        body: 'Inter'
                    },
                    layout: {
                        containerWidth: '1400px',
                        borderRadius: '0px'
                    }
                })
            ]);

            console.log('✅ Theme inserted successfully:', insertResult.rows[0]);
        }

        // List all themes
        console.log('\n📋 All themes in database:');
        const allThemes = await pool.query('SELECT id, name, slug, is_active FROM themes ORDER BY created_at DESC');
        console.table(allThemes.rows);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

main();
