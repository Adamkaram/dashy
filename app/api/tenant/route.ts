import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * GET /api/tenant
 * Get tenant by hostname (domain or subdomain)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hostname = searchParams.get('hostname') || 'localhost';

        console.log('Looking for tenant with hostname:', hostname);

        // Fast path for localhost during development
        if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
            console.log('Localhost detected, using default tenant');
            return NextResponse.json({
                id: '1c394a93-c200-4468-9e5f-958b859b415a',
                name: 'ماى مومنت - الموقع الرئيسي',
                slug: 'default',
                domain: null,
                subdomain: 'www',
                activeTheme: 'default',
                activeThemeConfig: null,
                plan: null,
                status: 'active',
            });
        }

        // Extract subdomain from hostname
        const parts = hostname.split('.');
        const subdomain = parts.length > 1 ? parts[0] : 'www';

        // Try to find tenant by subdomain using supabaseAdmin
        let { data: tenant, error } = await supabaseAdmin
            .from('tenants')
            .select('*')
            .eq('subdomain', subdomain)
            .single();

        // If no tenant found, get default tenant
        if (!tenant || error) {
            console.log('No tenant found for subdomain, using default');
            const result = await supabaseAdmin
                .from('tenants')
                .select('*')
                .eq('slug', 'default')
                .single();
            tenant = result.data;
        }

        if (!tenant) {
            return NextResponse.json(
                { error: 'No tenant found' },
                { status: 404 }
            );
        }

        // Get active theme if tenant has one
        let activeThemeName = 'default';
        let activeThemeConfig = null;

        if (tenant.active_theme_id) {
            const { data: activeTheme } = await supabaseAdmin
                .from('themes')
                .select('*')
                .eq('id', tenant.active_theme_id)
                .single();

            if (activeTheme) {
                activeThemeName = activeTheme.slug || 'default';
                activeThemeConfig = activeTheme.config || null;
            }
        }

        // Return tenant data
        return NextResponse.json({
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            domain: tenant.domain,
            subdomain: tenant.subdomain,
            activeTheme: activeThemeName,
            activeThemeConfig,
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
