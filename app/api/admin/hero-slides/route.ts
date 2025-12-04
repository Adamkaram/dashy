import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { db } from '@/lib/db';

// GET all hero slides
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('hero_slides')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Error fetching hero slides:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب الشرائح' },
            { status: 500 }
        );
    }
}

// POST create new hero slide
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { image, title, subtitle, display_order } = body;

        if (!image || !title) {
            return NextResponse.json(
                { error: 'الصورة والعنوان مطلوبان' },
                { status: 400 }
            );
        }

        // Get default tenant ID
        const defaultTenant = await db.query.tenants.findFirst({
            where: (tenants, { eq }) => eq(tenants.slug, 'default')
        });

        if (!defaultTenant) {
            return NextResponse.json(
                { error: 'لم يتم العثور على tenant افتراضي' },
                { status: 500 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('hero_slides')
            .insert([
                {
                    tenant_id: defaultTenant.id,
                    image,
                    title,
                    subtitle,
                    display_order: display_order || 0,
                    is_active: true,
                },
            ])
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new Error('فشل إنشاء الشريحة');
        }

        return NextResponse.json(data[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating hero slide:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في إنشاء الشريحة' },
            { status: 500 }
        );
    }
}
