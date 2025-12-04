import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error('Get session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
