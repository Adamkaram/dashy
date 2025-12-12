import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tenants } from '@/db/schema';
import jwt from 'jsonwebtoken';

const GATEWAY_URL = process.env.DOMAIN_GATEWAY_URL || 'http://localhost:8080';
const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key-for-signing-jwt-tokens-2024';

// Generate JWT token for the current tenant
async function generateToken(tenantId: string): Promise<string> {
    const payload = {
        tenant_id: tenantId,
        user_id: tenantId, // For now, use tenant_id as user_id
        role: 'admin',
        iss: 'domain-gateway',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };

    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

// Get default tenant
async function getDefaultTenant() {
    return await db.query.tenants.findFirst({
        where: (tenants, { eq }) => eq(tenants.slug, 'default')
    });
}

// GET all domains for tenant
export async function GET(request: NextRequest) {
    try {
        const tenant = await getDefaultTenant();
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const token = await generateToken(tenant.id);

        const response = await fetch(`${GATEWAY_URL}/api/domains`, {
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
        console.error('Error fetching domains:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch domains' },
            { status: 500 }
        );
    }
}

// POST create new domain
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { domain } = body;

        if (!domain) {
            return NextResponse.json(
                { error: 'Domain is required' },
                { status: 400 }
            );
        }

        const tenant = await getDefaultTenant();
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const token = await generateToken(tenant.id);

        const response = await fetch(`${GATEWAY_URL}/api/domains`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ domain }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('Error creating domain:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create domain' },
            { status: 500 }
        );
    }
}
