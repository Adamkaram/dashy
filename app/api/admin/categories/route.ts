import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories, tenants } from '@/db/schema';
import { asc } from 'drizzle-orm';

// GET all categories
export async function GET() {
    try {
        const data = await db.query.categories.findMany({
            orderBy: [asc(categories.displayOrder)]
        });

        console.log('Raw categories from DB:', data);
        console.log('First category image:', data[0]?.image);

        // Map to snake_case for frontend compatibility
        const mappedData = data.map(cat => ({
            ...cat,
            parent_id: cat.parentId,
            display_order: cat.displayOrder,
            is_active: cat.isActive,
        }));

        console.log('Mapped categories:', mappedData);
        return NextResponse.json(mappedData);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب التصنيفات' },
            { status: 500 }
        );
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, name, description, image, display_order, parent_id } = body;

        if (!slug || !name) {
            return NextResponse.json(
                { error: 'الاسم والـ slug مطلوبان' },
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

        const [newCategory] = await db.insert(categories).values({
            tenantId: defaultTenant.id,
            slug,
            name,
            description,
            image,
            parentId: parent_id || null,
            displayOrder: display_order || 0,
            isActive: true,
        }).returning();

        // Map to snake_case for frontend compatibility
        const mappedCategory = {
            ...newCategory,
            parent_id: newCategory.parentId,
            display_order: newCategory.displayOrder,
            is_active: newCategory.isActive,
        };

        return NextResponse.json(mappedCategory, { status: 201 });
    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في إنشاء التصنيف' },
            { status: 500 }
        );
    }
}
