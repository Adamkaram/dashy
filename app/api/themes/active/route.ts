import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/themes/active
 * Get the currently active theme for the tenant
 */
export async function GET() {
    try {
        // Get the default tenant's active theme
        const defaultTenant = await db.query.tenants.findFirst({
            where: (tenants, { eq }) => eq(tenants.slug, 'default')
        });

        if (!defaultTenant) {
            // If no tenant found, return default theme
            return NextResponse.json({
                name: 'default',
                displayName: 'Default Theme',
            });
        }

        // Get the active theme for this tenant
        const activeTheme = await db.query.themes.findFirst({
            where: (themes, { and, eq }) => and(
                eq(themes.tenantId, defaultTenant.id),
                eq(themes.isActive, true)
            )
        });

        if (!activeTheme) {
            // If no active theme found, return default
            return NextResponse.json({
                name: 'default',
                displayName: 'Default Theme',
            });
        }

        return NextResponse.json({
            id: activeTheme.id,
            name: activeTheme.name,
            displayName: activeTheme.displayName,
            description: activeTheme.description,
        });
    } catch (error) {
        console.error('Error fetching active theme:', error);
        // On error, return default theme to prevent app crash
        return NextResponse.json({
            name: 'default',
            displayName: 'Default Theme',
        });
    }
}
