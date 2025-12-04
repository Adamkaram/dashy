import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET single hero slide
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { data, error } = await supabaseAdmin
            .from('hero_slides')
            .select('*')
            .eq('id', id);

        if (error) throw error;

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: 'الشريحة غير موجودة' },
                { status: 404 }
            );
        }

        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Error fetching hero slide:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب الشريحة' },
            { status: 500 }
        );
    }
}

// PUT update hero slide
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { image, title, subtitle, title_color, subtitle_color, display_order, is_active } = body;

        const { data, error } = await supabaseAdmin
            .from('hero_slides')
            .update({
                image,
                title,
                subtitle,
                title_color,
                subtitle_color,
                display_order,
                is_active,
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: 'فشل تحديث الشريحة (قد تكون غير موجودة)' },
                { status: 404 }
            );
        }

        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Error updating hero slide:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في تحديث الشريحة' },
            { status: 500 }
        );
    }
}

// DELETE hero slide
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { error } = await supabaseAdmin
            .from('hero_slides')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting hero slide:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في حذف الشريحة' },
            { status: 500 }
        );
    }
}
