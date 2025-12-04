import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            service_id,
            customer_name,
            customer_phone,
            date,
            time,
            area,
            coupon_code,
            discount,
            total_amount,
            notes,
            selected_options
        } = body;

        // Validation
        if (!service_id || !customer_name || !customer_phone || !date || !time || !area) {
            return NextResponse.json(
                { error: 'جميع الحقول الأساسية مطلوبة (الاسم، الهاتف، التاريخ، الوقت، المنطقة)' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('orders')
            .insert([
                {
                    service_id,
                    customer_name,
                    customer_phone,
                    date,
                    time,
                    area,
                    coupon_code,
                    discount: discount || 0,
                    total_amount,
                    notes,
                    selected_options: selected_options || {},
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        // Increment coupon usage count if coupon was used
        if (coupon_code) {
            const { data: coupon } = await supabaseAdmin
                .from('coupons')
                .select('used_count')
                .eq('code', coupon_code.toUpperCase())
                .single();

            if (coupon) {
                await supabaseAdmin
                    .from('coupons')
                    .update({
                        used_count: (coupon.used_count || 0) + 1
                    })
                    .eq('code', coupon_code.toUpperCase());
            }
        }

        return NextResponse.json({ success: true, order: data }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في إنشاء الطلب' },
            { status: 500 }
        );
    }
}
