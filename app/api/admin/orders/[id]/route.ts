import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في تحديث الطلب' },
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
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting order:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في حذف الطلب' },
            { status: 500 }
        );
    }
}
