import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tenants, themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/themes/tenant/[slug]
 * Load theme for a specific tenant
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        // Find tenant
        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.slug, slug),
        });

        if (!tenant) {
            return NextResponse.json(
                { error: 'Tenant not found' },
                { status: 404 }
            );
        }

        // Get active theme
        let theme;
        if (tenant.activeThemeId) {
            theme = await db.query.themes.findFirst({
                where: eq(themes.id, tenant.activeThemeId),
            });
        }

        // Fallback to default theme
        if (!theme) {
            theme = await db.query.themes.findFirst({
                where: eq(themes.slug, 'default'),
            });
        }

        if (!theme) {
            return NextResponse.json(
                { error: 'No theme found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            tenant,
            theme,
        });
    } catch (error) {
        console.error('Error loading tenant theme:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
