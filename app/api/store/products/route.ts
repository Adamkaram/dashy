import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const subdomain = request.headers.get('x-tenant-subdomain');

        let storeId: string | null = null;

        // Find store by slug or subdomain
        if (slug) {
            const { data: store } = await supabaseAdmin
                .from('stores')
                .select('id')
                .eq('slug', slug)
                .single();
            storeId = store?.id;
        } else if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
            const { data: store } = await supabaseAdmin
                .from('stores')
                .select('id')
                .eq('slug', subdomain)
                .single();
            storeId = store?.id;
        }

        // If no store found, get default store
        if (!storeId) {
            const { data: defaultStore } = await supabaseAdmin
                .from('stores')
                .select('id')
                .eq('slug', 'default')
                .single();
            storeId = defaultStore?.id;
        }

        if (!storeId) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        // Get products for this store with categories
        const { data: allProducts, error } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories(*)
            `)
            .eq('store_id', storeId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map to camelCase for frontend compatibility
        const mappedProducts = (allProducts || []).map((product: any) => ({
            ...product,
            basePrice: product.base_price,
            salePrice: product.sale_price,
            categoryId: product.category_id,
            isActive: product.is_active,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
        }));

        return NextResponse.json(mappedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
