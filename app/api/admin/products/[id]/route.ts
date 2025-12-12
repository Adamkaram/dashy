import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, productImages, productOptions } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

// GET single service (product)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await db.query.products.findFirst({
            where: eq(products.id, id),
            with: {
                category: true,
                images: {
                    orderBy: [asc(productImages.displayOrder)]
                },
                options: {
                    orderBy: [asc(productOptions.displayOrder)]
                }
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: 'الخدمة غير موجودة' },
                { status: 404 }
            );
        }

        // Map to snake_case for frontend compatibility
        const mappedService = {
            ...product,
            category_id: product.categoryId,
            base_price: product.basePrice,
            sale_price: product.salePrice,
            is_active: product.isActive,
            // Inventory fields
            sku: product.sku,
            brand: product.brand,
            quantity: product.quantity,
            low_stock_threshold: product.lowStockThreshold,
            metadata: product.metadata,
            created_at: product.createdAt,
            updated_at: product.updatedAt,
            options: product.options.map(opt => ({
                ...opt,
                is_required: opt.isRequired,
                display_order: opt.displayOrder,
            }))
        };

        return NextResponse.json(mappedService);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب الخدمة' },
            { status: 500 }
        );
    }
}

// PUT update service
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log('=== PUT /api/admin/services/[id] ===');
        console.log('Service ID:', id);
        console.log('Request body:', body);

        const { slug, category_id, title, subtitle, image, description, base_price, is_active, options, images, metadata, sku, brand, quantity, low_stock_threshold } = body;
        console.log('Extracted is_active:', is_active);

        // Update product
        const [updatedService] = await db.update(products)
            .set({
                slug,
                categoryId: category_id,
                title,
                subtitle,
                image: images && images.length > 0 ? images[0] : image, // Use first image as main
                description,
                basePrice: base_price,
                salePrice: body.sale_price,
                isActive: is_active,
                // Inventory fields
                sku: sku || null,
                brand: brand || null,
                quantity: quantity || 0,
                lowStockThreshold: low_stock_threshold || 5,
                metadata: metadata || {},
                updatedAt: new Date()
            })
            .where(eq(products.id, id))
            .returning();

        if (!updatedService) {
            return NextResponse.json(
                { error: 'الخدمة غير موجودة' },
                { status: 404 }
            );
        }

        // Update Options: Delete existing and insert new
        if (options && Array.isArray(options)) {
            await db.delete(productOptions).where(eq(productOptions.productId, id));

            if (options.length > 0) {
                await db.insert(productOptions).values(
                    options.map((opt: any, idx: number) => ({
                        productId: id,
                        title: opt.title,
                        type: opt.type,
                        isRequired: opt.is_required,
                        price: opt.price || 0,
                        options: opt.options, // JSONB
                        displayOrder: idx,
                    }))
                );
            }
        }

        // Update Images: Delete existing and insert new
        if (images && Array.isArray(images)) {
            await db.delete(productImages).where(eq(productImages.productId, id));

            if (images.length > 0) {
                // Get tenant_id from the product
                const product = await db.query.products.findFirst({
                    where: eq(products.id, id),
                    columns: { tenantId: true }
                });

                if (product) {
                    await db.insert(productImages).values(
                        images.map((imageUrl: string, idx: number) => ({
                            tenantId: product.tenantId,
                            productId: id,
                            imageUrl: imageUrl,
                            displayOrder: idx,
                        }))
                    );
                }
            }
        }

        console.log('Updated service from DB:', updatedService);

        // Fetch updated product with options and images
        const finalService = await db.query.products.findFirst({
            where: eq(products.id, id),
            with: {
                images: {
                    orderBy: [asc(productImages.displayOrder)]
                },
                options: {
                    orderBy: [asc(productOptions.displayOrder)]
                }
            }
        });

        if (!finalService) throw new Error('Failed to fetch updated service');

        // Map to snake_case for frontend compatibility
        const mappedService = {
            ...finalService,
            category_id: finalService.categoryId,
            base_price: finalService.basePrice,
            is_active: finalService.isActive,
            metadata: finalService.metadata,
            created_at: finalService.createdAt,
            updated_at: finalService.updatedAt,
            options: finalService.options.map(opt => ({
                ...opt,
                is_required: opt.isRequired,
                display_order: opt.displayOrder,
            }))
        };

        return NextResponse.json(mappedService);
    } catch (error: any) {
        console.error('Error updating service:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في تحديث المنتج' },
            { status: 500 }
        );
    }
}

// DELETE service
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.delete(products)
            .where(eq(products.id, id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في حذف المنتج' },
            { status: 500 }
        );
    }
}
