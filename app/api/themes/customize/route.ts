import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { themeSettings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/themes/customize
 * Save theme customizations for a tenant
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tenantId, themeId, customizations } = body;

        if (!tenantId || !themeId || !customizations) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if settings already exist
        const existing = await db.query.themeSettings.findFirst({
            where: and(
                eq(themeSettings.tenantId, tenantId),
                eq(themeSettings.themeId, themeId)
            ),
        });

        let result;
        if (existing) {
            // Update existing settings
            result = await db
                .update(themeSettings)
                .set({
                    customizations,
                    updatedAt: new Date(),
                })
                .where(eq(themeSettings.id, existing.id))
                .returning();
        } else {
            // Create new settings
            result = await db
                .insert(themeSettings)
                .values({
                    tenantId,
                    themeId,
                    customizations,
                })
                .returning();
        }

        return NextResponse.json({
            success: true,
            settings: result[0],
        });
    } catch (error) {
        console.error('Error saving customizations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/themes/customize?tenantId=xxx&themeId=xxx
 * Get theme customizations for a tenant
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');
        const themeId = searchParams.get('themeId');

        if (!tenantId || !themeId) {
            return NextResponse.json(
                { error: 'Missing tenantId or themeId' },
                { status: 400 }
            );
        }

        const settings = await db.query.themeSettings.findFirst({
            where: and(
                eq(themeSettings.tenantId, tenantId),
                eq(themeSettings.themeId, themeId)
            ),
        });

        if (!settings) {
            return NextResponse.json(
                { customizations: {} },
                { status: 200 }
            );
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching customizations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
