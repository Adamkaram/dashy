import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = await db.query.categories.findFirst({
            where: eq(categories.id, id)
        });

        if (!category) {
            return NextResponse.json(
                { error: 'التصنيف غير موجود' },
                { status: 404 }
            );
        }

        // Map to snake_case for frontend compatibility
        const mappedCategory = {
            ...category,
            parent_id: category.parentId,
            display_order: category.displayOrder,
            is_active: category.isActive,
        };

        return NextResponse.json(mappedCategory);
    } catch (error: any) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب التصنيف' },
            { status: 500 }
        );
    }
}

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('=== PUT /api/admin/categories/[id] ===');
        console.log('Category ID:', id);

        const body = await request.json();
        console.log('Request body:', body);

        const { slug, name, description, image, display_order, is_active, parent_id } = body;
        console.log('Extracted fields:', { slug, name, description, image, display_order, is_active, parent_id });

        console.log('Attempting to update category...');
        const [updatedCategory] = await db.update(categories)
            .set({
                slug,
                name,
                description,
                image,
                parentId: parent_id || null,
                displayOrder: display_order,
                isActive: is_active,
                updatedAt: new Date()
            })
            .where(eq(categories.id, id))
            .returning();

        console.log('Update successful. Updated category:', updatedCategory);

        // Map to snake_case for frontend compatibility
        const mappedCategory = {
            ...updatedCategory,
            parent_id: updatedCategory.parentId,
            display_order: updatedCategory.displayOrder,
            is_active: updatedCategory.isActive,
        };

        console.log('Mapped category:', mappedCategory);
        return NextResponse.json(mappedCategory);
    } catch (error: any) {
        console.error('Error updating category:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json(
            { error: error.message || 'فشل في تحديث التصنيف', details: error.toString() },
            { status: 500 }
        );
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.delete(categories)
            .where(eq(categories.id, id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في حذف التصنيف' },
            { status: 500 }
        );
    }
}
