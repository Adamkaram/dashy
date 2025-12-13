import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - List all dashboard content
export async function GET(request: Request) {
    try {
        const supabase = supabaseAdmin
        const { searchParams } = new URL(request.url)

        const category = searchParams.get('category')
        const location = searchParams.get('location')
        const activeOnly = searchParams.get('active') !== 'false'

        let query = supabase
            .from('dashboard_content')
            .select('*')
            .order('display_order', { ascending: true })

        if (activeOnly) {
            query = query.eq('is_active', true)
        }

        if (category) {
            query = query.eq('category', category)
        }

        if (location) {
            query = query.contains('display_location', [location])
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }
}

// POST - Create new dashboard content
export async function POST(request: Request) {
    try {
        const supabase = supabaseAdmin
        const body = await request.json()

        const { type, title, description, content, category, display_location, is_active, display_order } = body

        if (!type || !title) {
            return NextResponse.json({ error: 'Type and title are required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('dashboard_content')
            .insert({
                type,
                title,
                description,
                content: content || {},
                category: category || 'general',
                display_location: display_location || ['dashboard'],
                is_active: is_active !== false,
                display_order: display_order || 0
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
    }
}
