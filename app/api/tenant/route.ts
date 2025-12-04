import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/tenant
 * Get tenant by hostname (domain or subdomain)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hostname = searchParams.get('hostname') || 'localhost';

        console.log('Looking for tenant with hostname:', hostname);

        // Extract subdomain from hostname
        // e.g., "tenant1.localhost" -> "tenant1"
        const parts = hostname.split('.');
        const subdomain = parts.length > 1 ? parts[0] : 'www';

        // Try to find tenant by subdomain or use default
        let tenant = await db.query.tenants.findFirst({
            where: (tenants, { eq }) => eq(tenants.subdomain, subdomain)
        });

        // If no tenant found, get default tenant
        if (!tenant) {
            console.log('No tenant found for subdomain, using default');
            tenant = await db.query.tenants.findFirst({
                where: (tenants, { eq }) => eq(tenants.slug, 'default')
            });
        }

        if (!tenant) {
            return NextResponse.json(
                { error: 'No tenant found' },
                { status: 404 }
            );
        }

        // Get active theme if tenant has one
        let activeThemeName = 'default';
        if (tenant.activeThemeId) {
            const activeTheme = await db.query.themes.findFirst({
                where: (th, { eq }) => eq(th.id, tenant.activeThemeId!)
            });
            activeThemeName = activeTheme?.name || 'default';
        }

        // Return tenant data
        return NextResponse.json({
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            domain: tenant.domain,
            subdomain: tenant.subdomain,
            activeTheme: activeThemeName,
            plan: tenant.plan,
            status: tenant.status,
        });
    } catch (error) {
        console.error('Error fetching tenant:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
