import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications, tenants } from '@/db/schema';

// POST - Broadcast notification to all tenants
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, title, description, icon, image, action_url, action_label, metadata } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        // Get all active tenants
        const allTenants = await db.query.tenants.findMany({
            where: (tenants, { eq }) => eq(tenants.status, 'active')
        });

        if (allTenants.length === 0) {
            return NextResponse.json(
                { error: 'No active tenants found' },
                { status: 404 }
            );
        }

        // Create notification for each tenant
        const notificationValues = allTenants.map(tenant => ({
            tenantId: tenant.id,
            source: 'system' as const, // Mark as system notification
            type: type || 'info',
            title,
            description,
            icon,
            image, // Include image
            read: false,
            actionUrl: action_url,
            actionLabel: action_label,
            metadata: metadata || {},
        }));

        const createdNotifications = await db.insert(notifications)
            .values(notificationValues)
            .returning();

        console.log(`Broadcast notification sent to ${createdNotifications.length} tenants`);

        return NextResponse.json({
            success: true,
            message: `تم إرسال الإشعار إلى ${createdNotifications.length} مستأجر`,
            count: createdNotifications.length
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error broadcasting notification:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to broadcast notification' },
            { status: 500 }
        );
    }
}
