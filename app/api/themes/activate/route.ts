import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/themes/activate
 * Activate a theme for a tenant by updating active_theme_id
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { themeId, tenantId } = body;

        if (!themeId || !tenantId) {
            return NextResponse.json(
                { error: 'themeId and tenantId are required' },
                { status: 400 }
            );
        }

        // Verify theme exists and is active
        const theme = await db.query.themes.findFirst({
            where: (themes, { eq }) => eq(themes.id, themeId)
        });

        if (!theme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        if (!theme.isActive) {
            return NextResponse.json(
                { error: 'Theme is not active' },
                { status: 400 }
            );
        }

        // Update tenant's active_theme_id
        await db.update(tenants)
            .set({
                activeThemeId: themeId,
                updatedAt: new Date()
            })
            .where(eq(tenants.id, tenantId));

        return NextResponse.json({
            success: true,
            message: 'Theme activated successfully',
            themeName: theme.name
        });
    } catch (error) {
        console.error('Error activating theme:', error);
        return NextResponse.json(
            { error: 'Failed to activate theme' },
            { status: 500 }
        );
    }
}
