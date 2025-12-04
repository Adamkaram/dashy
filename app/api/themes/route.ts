import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/themes
 * Get all available themes
 */
export async function GET() {
    try {
        const allThemes = await db.query.themes.findMany({
            orderBy: (themes, { asc }) => [asc(themes.createdAt)]
        });

        return NextResponse.json(allThemes);
    } catch (error) {
        console.error('Error fetching themes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch themes' },
            { status: 500 }
        );
    }
}
