import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET all products
export async function GET() {
    try {
        console.log('Fetching products with supabaseAdmin...');

        const { data, error } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories(*),
                images:product_images(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log(`Fetched ${data?.length || 0} products`);
        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في جلب المنتجات' },
            { status: 500 }
        );
    }
}

// POST create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, category_id, title, image, description, base_price, images, metadata, store_id } = body;

        if (!slug || !category_id || !title) {
            return NextResponse.json(
                { error: 'الحقول المطلوبة: slug, category_id, title' },
                { status: 400 }
            );
        }

        // Get store_id from body or default store
        let finalStoreId = store_id;
        if (!finalStoreId) {
            const { data: defaultStore } = await supabaseAdmin
                .from('stores')
                .select('id')
                .eq('slug', 'default')
                .single();
            finalStoreId = defaultStore?.id;
        }

        if (!finalStoreId) {
            return NextResponse.json(
                { error: 'لم يتم العثور على متجر' },
                { status: 500 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .insert([
                {
                    store_id: finalStoreId,
                    slug,
                    category_id,
                    title,
                    image: images && images.length > 0 ? images[0] : image,
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
                product_id: data.id,
                image_url: imageUrl,
                display_order: index,
            }));

            const { error: imagesError } = await supabaseAdmin
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
            { error: error.message || 'فشل في إنشاء المنتج' },
            { status: 500 }
        );
    }
}
