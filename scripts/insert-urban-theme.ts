
import { db } from '../lib/db';
import { themes } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Inserting Urban Vogue theme...');

    try {
        await db.insert(themes).values({
            name: 'Urban Vogue',
            slug: 'urban-vogue',
            description: 'A premium, high-fashion theme with dynamic animations inspired by The Stahps.',
            isActive: true,
            config: {
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
            }
        }).onConflictDoNothing();

        console.log('Theme inserted successfully!');
    } catch (error) {
        console.error('Error inserting theme:', error);
    }
    process.exit(0);
}

main();
