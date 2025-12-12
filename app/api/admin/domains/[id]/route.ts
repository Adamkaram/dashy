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

// GET single domain
export async function GET(
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

        const response = await fetch(`${GATEWAY_URL}/api/domains/${id}`, {
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
        console.error('Error fetching domain:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch domain' },
            { status: 500 }
        );
    }
}

// DELETE domain
export async function DELETE(
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

        const response = await fetch(`${GATEWAY_URL}/api/domains/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error('Error deleting domain:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete domain' },
            { status: 500 }
        );
    }
}

// PATCH update domain
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const tenant = await getDefaultTenant();
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const token = await generateToken(tenant.id);

        const response = await fetch(`${GATEWAY_URL}/api/domains/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating domain:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update domain' },
            { status: 500 }
        );
    }
}
