import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // First, try to get orders with products relationship
        let { data, error } = await supabaseAdmin
            .from('orders')
            .select(`
                *,
                products (
                    title,
                    image
                )
            `)
            .order('created_at', { ascending: false });

        // If the join fails (e.g., foreign key doesn't exist), fetch without join
        if (error) {
            console.warn('Failed to fetch orders with products join, fetching without join:', error.message);
            const result = await supabaseAdmin
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            data = result.data;
            error = result.error;
        }

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب الطلبات' },
            { status: 500 }
        );
    }
}
