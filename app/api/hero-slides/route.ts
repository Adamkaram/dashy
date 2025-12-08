import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const sql = `
            SELECT * FROM hero_slides 
            WHERE is_active = true 
            ORDER BY display_order ASC
        `;

        const result = await query(sql);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hero slides' },
            { status: 500 }
        );
    }
}
