import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const subdomain = request.headers.get('x-tenant-subdomain');

    let tenantId;

    if (slug) {
        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.slug, slug)
        });
        tenantId = tenant?.id;
    } else if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
        // Try finding tenant by subdomain (slug)
        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.slug, subdomain)
        });
        tenantId = tenant?.id;
    }

    if (!tenantId) {
        // Fallback for demo/localhost: try 'urban-vogue' if it exists, since user wants to test it
        // Or generic fallback.
        // For now, let's return 404 if not found, forcing client to provide proper context or slug.
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const allProducts = await db.query.products.findMany({
        where: eq(products.tenantId, tenantId),
        with: {
            category: true,
        }
    });

    return NextResponse.json(allProducts);
}
