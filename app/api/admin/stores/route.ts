import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Get all stores for current tenant with stats
export async function GET() {
    try {
        // Get stores
        const { data: stores, error } = await supabaseAdmin
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get stats for each store
        const storesWithStats = await Promise.all(
            (stores || []).map(async (store) => {
                const [products, categories, domains] = await Promise.all([
                    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('store_id', store.id),
                    supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }).eq('store_id', store.id),
                    supabaseAdmin.from('domains').select('id', { count: 'exact', head: true }).eq('store_id', store.id)
                ])
                return {
                    ...store,
                    _stats: {
                        products: products.count || 0,
                        categories: categories.count || 0,
                        domains: domains.count || 0
                    }
                }
            })
        )

        return NextResponse.json(storesWithStats)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
    }
}

// Create a new store
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, description, logo, tenant_id } = body

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('stores')
            .insert({
                name,
                slug,
                description,
                logo,
                tenant_id,
                settings: {},
                is_active: true
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Store slug already exists' }, { status: 409 })
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create store' }, { status: 500 })
    }
}
