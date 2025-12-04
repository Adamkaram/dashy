import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, order_amount } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'كود الكوبون مطلوب' },
                { status: 400 }
            );
        }

        // Fetch coupon
        const { data: coupon, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (error || !coupon) {
            return NextResponse.json(
                { error: 'كود الكوبون غير صحيح' },
                { status: 404 }
            );
        }

        // Validate coupon
        const now = new Date();

        // Check if active
        if (!coupon.is_active) {
            return NextResponse.json(
                { error: 'هذا الكوبون غير نشط' },
                { status: 400 }
            );
        }

        // Check expiration
        if (coupon.expires_at && new Date(coupon.expires_at) < now) {
            return NextResponse.json(
                { error: 'هذا الكوبون منتهي الصلاحية' },
                { status: 400 }
            );
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return NextResponse.json(
                { error: 'تم استخدام هذا الكوبون بالكامل' },
                { status: 400 }
            );
        }

        // Check minimum order amount
        if (order_amount && coupon.min_order_amount && order_amount < coupon.min_order_amount) {
            return NextResponse.json(
                { error: `الحد الأدنى للطلب ${coupon.min_order_amount} د.ك` },
                { status: 400 }
            );
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discount_type === 'fixed') {
            discount = coupon.discount_value;
        } else if (coupon.discount_type === 'percentage' && order_amount) {
            discount = (order_amount * coupon.discount_value) / 100;
            // Apply max discount if set
            if (coupon.max_discount && discount > coupon.max_discount) {
                discount = coupon.max_discount;
            }
        }

        return NextResponse.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value,
            },
            discount: Math.round(discount * 100) / 100, // Round to 2 decimals
        });

    } catch (error: any) {
        console.error('Error validating coupon:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في التحقق من الكوبون' },
            { status: 500 }
        );
    }
}
