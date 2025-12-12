import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, tenants } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'; // Keep for POST for now or migrate later

// GET all services (products)
export async function GET() {
    try {
        console.log('Fetching products with Drizzle...');
        const data = await db.query.products.findMany({
            with: {
                category: true,
                images: true
            },
            orderBy: [desc(products.createdAt)]
        });

        // Map to snake_case for frontend compatibility
        const mappedData = data.map(product => ({
            ...product,
            category_id: product.categoryId,
            base_price: product.basePrice,
            is_active: product.isActive,
            metadata: product.metadata,
            created_at: product.createdAt,
            updated_at: product.updatedAt,
        }));

        console.log(`Fetched ${data.length} products`);
        return NextResponse.json(mappedData);
    } catch (error: any) {
        console.error('Error fetching products (Drizzle):', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب الخدمات', details: error },
            { status: 500 }
        );
    }
}

// POST create new service (product)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, category_id, title, image, description, base_price, images, metadata } = body;

        if (!slug || !category_id || !title) {
            return NextResponse.json(
                { error: 'الحقول المطلوبة: slug, category_id, title' },
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

        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    tenant_id: defaultTenant.id,
                    slug,
                    category_id,
                    title,
                    image: images && images.length > 0 ? images[0] : image, // Use first image as main
                    description,
                    base_price: base_price || 0,
                    sale_price: body.sale_price || 0,
                    is_active: true,
                    metadata: metadata || {},
                },
            ])
            .select()
            .single();

        if (error) throw error;

        // Save images to product_images table
        if (images && Array.isArray(images) && images.length > 0) {
            const imageRecords = images.map((imageUrl: string, index: number) => ({
                tenant_id: defaultTenant.id,
                product_id: data.id,
                image_url: imageUrl,
                display_order: index,
            }));

            const { error: imagesError } = await supabase
                .from('product_images')
                .insert(imageRecords);

            if (imagesError) {
                console.error('Error saving product images:', imagesError);
            }
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في إنشاء الخدمة' },
            { status: 500 }
        );
    }
}
