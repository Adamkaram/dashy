import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/themes/[id]
 * Get theme details by ID
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        console.log('Fetching theme with ID:', params.id);
        const theme = await db.query.themes.findFirst({
            where: (themes, { eq }) => eq(themes.id, params.id)
        });
        console.log('Theme found:', theme ? 'Yes' : 'No');

        if (!theme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(theme);
    } catch (error) {
        console.error('Error fetching theme:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/themes/[id]
 * Update theme configuration
 */
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { config } = body;

        if (!config) {
            return NextResponse.json(
                { error: 'Config is required' },
                { status: 400 }
            );
        }

        // Verify theme exists
        const existingTheme = await db.query.themes.findFirst({
            where: (themes, { eq }) => eq(themes.id, params.id)
        });

        if (!existingTheme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        // Update theme config
        // Merge with existing config to prevent data loss
        const updatedConfig = {
            ...existingTheme.config as object,
            ...config
        };

        await db.update(themes)
            .set({
                config: updatedConfig,
                updatedAt: new Date()
            })
            .where(eq(themes.id, params.id));

        return NextResponse.json({
            success: true,
            message: 'Theme updated successfully',
            config: updatedConfig
        });
    } catch (error) {
        console.error('Error updating theme:', error);
        return NextResponse.json(
            { error: 'Failed to update theme' },
            { status: 500 }
        );
    }
}
