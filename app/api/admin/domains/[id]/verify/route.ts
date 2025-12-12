import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tenants } from '@/db/schema';
import jwt from 'jsonwebtoken';

const GATEWAY_URL = process.env.DOMAIN_GATEWAY_URL || 'http://localhost:8080';
const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key-for-signing-jwt-tokens-2024';

async function generateToken(tenantId: string): Promise<string> {
    const payload = {
        tenant_id: tenantId,
        user_id: tenantId,
        role: 'admin',
        iss: 'domain-gateway',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    };

    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

async function getDefaultTenant() {
    return await db.query.tenants.findFirst({
        where: (tenants, { eq }) => eq(tenants.slug, 'default')
    });
}

// POST verify domain
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tenant = await getDefaultTenant();
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const token = await generateToken(tenant.id);

        const response = await fetch(`${GATEWAY_URL}/api/domains/${id}/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error verifying domain:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to verify domain' },
            { status: 500 }
        );
    }
}

