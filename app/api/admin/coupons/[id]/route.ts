import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .update({
                code: body.code ? body.code.toUpperCase() : undefined,
                discount_type: body.discount_type,
                discount_value: body.discount_value,
                min_order_amount: body.min_order_amount,
                max_discount_amount: body.max_discount,
                usage_limit: body.usage_limit,
                valid_until: body.expires_at,
                is_active: body.is_active,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating coupon:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في تحديث الكوبون' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { error } = await supabaseAdmin
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في حذف الكوبون' },
            { status: 500 }
        );
    }
}
