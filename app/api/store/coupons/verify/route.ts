
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { eq, and, gt, or, isNull } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, tenantId } = body;

        // Note: In a real multi-tenant app, you might extract tenantId from the domain/subdomain middleware
        // instead of trusting the client body. For now we assume tenantId corresponds to the active store.

        if (!code) {
            return NextResponse.json(
                { valid: false, message: 'Please provide a coupon code' },
                { status: 400 }
            );
        }

        const now = new Date();

        // Find coupon matching code and tenant
        // And is active
        // And (end_date is null OR end_date > now)
        const coupon = await db.query.coupons.findFirst({
            where: and(
                eq(coupons.code, code),
                eq(coupons.isActive, true),
                // Since Drizzle 'gt' compares values, we need to handle the potentially null endDate carefully
                // But generally checking logical constraints in application code is safer for complex null handling 
                // if ORM features are tricky. Or use raw SQL filter.
                // Let's fetch it first, then check dates in JS to be safe and simple.
                ...(tenantId ? [eq(coupons.tenantId, tenantId)] : [])
            )
        });

        if (!coupon) {
            return NextResponse.json(
                { valid: false, message: 'رمز القسيمة غير صالح' }, // Invalid coupon code
                { status: 404 }
            );
        }

        // 1. Check Start Date
        if (coupon.startDate && coupon.startDate > now) {
            return NextResponse.json(
                { valid: false, message: 'هذه القسيمة لم تبدأ بعد' }, // Coupon not active yet
                { status: 400 }
            );
        }

        // 2. Check End Date
        if (coupon.endDate && coupon.endDate < now) {
            return NextResponse.json(
                { valid: false, message: 'انتهت صلاحية هذه القسيمة' }, // Coupon expired
                { status: 400 }
            );
        }

        // 3. Check Usage Limit
        if (coupon.usageLimit !== null && (coupon.usageCount || 0) >= coupon.usageLimit) {
            return NextResponse.json(
                { valid: false, message: 'تم تجاوز الحد الأقصى لاستخدام هذه القسيمة' }, // Usage limit reached
                { status: 400 }
            );
        }

        return NextResponse.json({
            valid: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: parseFloat(coupon.discountValue as string), // Decimal returns as string
            }
        });

    } catch (error: any) {
        console.error('Error verifying coupon:', error);
        return NextResponse.json(
            { valid: false, message: 'حدث خطأ أثناء التحقق من القسيمة' }, // Generic error
            { status: 500 }
        );
    }
}
