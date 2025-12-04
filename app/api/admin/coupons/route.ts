import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map database columns to frontend interface
        const mappedData = data?.map(coupon => ({
            ...coupon,
            expires_at: coupon.valid_until,
            max_discount: coupon.max_discount_amount,
            used_count: coupon.usage_count
        })) || [];

        return NextResponse.json(mappedData);
    } catch (error: any) {
        console.error('Error fetching coupons:', error);
        // Return empty array on error to prevent frontend crash
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            code,
            discount_type,
            discount_value,
            min_order_amount,
            max_discount,
            usage_limit,
            expires_at,
            is_active
        } = body;

        // Validation
        if (!code || !discount_type || !discount_value) {
            return NextResponse.json(
                { error: 'الكود ونوع الخصم والقيمة مطلوبة' },
                { status: 400 }
            );
        }

        if (!['percentage', 'fixed'].includes(discount_type)) {
            return NextResponse.json(
                { error: 'نوع الخصم يجب أن يكون percentage أو fixed' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('coupons')
            .insert([
                {
                    code: code.toUpperCase(),
                    discount_type,
                    discount_value,
                    min_order_amount: min_order_amount || 0,
                    max_discount_amount: max_discount,
                    usage_limit,
                    valid_until: expires_at,
                    valid_from: new Date().toISOString(), // Default to now
                    is_active: is_active !== undefined ? is_active : true,
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });

    } catch (error: any) {
        console.error('Error creating coupon:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: error.message || 'فشل في إنشاء الكوبون', details: error },
            { status: 500 }
        );
    }
}
