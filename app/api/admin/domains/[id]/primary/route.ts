import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

async function getAuthToken() {
    const cookieStore = await cookies()
    const tenantId = cookieStore.get('tenant_id')?.value || 'default-tenant'

    const token = jwt.sign(
        { tenant_id: tenantId, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    )

    return { token, tenantId }
}

// POST /api/admin/domains/[id]/primary - Set domain as primary
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { token } = await getAuthToken()

        const gatewayUrl = process.env.DOMAIN_GATEWAY_URL || 'http://localhost:8080'

        const response = await fetch(`${gatewayUrl}/api/domains/${id}/primary`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            return NextResponse.json(error, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Failed to set primary domain:', error)
        return NextResponse.json(
            { error: 'Failed to set primary domain' },
            { status: 500 }
        )
    }
}
