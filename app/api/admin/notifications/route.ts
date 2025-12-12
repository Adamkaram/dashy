import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications, tenants } from '@/db/schema';
import { desc, eq, and, isNull } from 'drizzle-orm';

// GET all notifications for the current tenant
export async function GET(request: NextRequest) {
    try {
        console.log('Fetching notifications...');

        // Get tenant (default for now, or from headers/auth later)
        const defaultTenant = await db.query.tenants.findFirst({
            where: (tenants, { eq }) => eq(tenants.slug, 'default')
        });

        if (!defaultTenant) {
            return NextResponse.json(
                { error: 'Tenant not found' },
                { status: 404 }
            );
        }

        const data = await db.query.notifications.findMany({
            where: (notifications, { eq }) => eq(notifications.tenantId, defaultTenant.id),
            orderBy: [desc(notifications.createdAt)],
            limit: 50 // Limit to last 50 notifications
        });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

// POST create new notification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, title, description, icon, action_url, action_label, entity_type, entity_id, metadata } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        // Get tenant
        const defaultTenant = await db.query.tenants.findFirst({
            where: (tenants, { eq }) => eq(tenants.slug, 'default')
        });

        if (!defaultTenant) {
            return NextResponse.json(
                { error: 'Tenant not found' },
                { status: 404 }
            );
        }

        const newNotification = await db.insert(notifications).values({
            tenantId: defaultTenant.id,
            type: type || 'info',
            title,
            description,
            icon,
            read: false,
            actionUrl: action_url,
            actionLabel: action_label,
            entityType: entity_type,
            entityId: entity_id,
            metadata: metadata || {},
        }).returning();

        return NextResponse.json(newNotification[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating notification:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create notification' },
            { status: 500 }
        );
    }
}

// PUT mark as read (single or all)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, all } = body;

        // Get tenant
        const defaultTenant = await db.query.tenants.findFirst({
            where: (tenants, { eq }) => eq(tenants.slug, 'default')
        });

        if (!defaultTenant) {
            return NextResponse.json(
                { error: 'Tenant not found' },
                { status: 404 }
            );
        }

        if (all) {
            // Mark all as read for this tenant
            await db.update(notifications)
                .set({ read: true, readAt: new Date() })
                .where(and(
                    eq(notifications.tenantId, defaultTenant.id),
                    eq(notifications.read, false)
                ));

            return NextResponse.json({ success: true, message: 'All marked as read' });
        } else if (id) {
            // Mark single as read
            const updated = await db.update(notifications)
                .set({ read: true, readAt: new Date() })
                .where(and(
                    eq(notifications.id, id),
                    eq(notifications.tenantId, defaultTenant.id)
                ))
                .returning();

            if (updated.length === 0) {
                return NextResponse.json(
                    { error: 'Notification not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(updated[0]);
        } else {
            return NextResponse.json(
                { error: 'ID or "all" flag required' },
                { status: 400 }
            );
        }

    } catch (error: any) {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update notification' },
            { status: 500 }
        );
    }
}
