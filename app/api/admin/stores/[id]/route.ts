import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Get a single store
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const { data, error } = await supabaseAdmin
            .from('stores')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch store' }, { status: 500 })
    }
}

// Update a store
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const { name, slug, description, logo, settings, is_active } = body

        const updateData: Record<string, any> = {
            updated_at: new Date().toISOString()
        }

        if (name !== undefined) updateData.name = name
        if (slug !== undefined) updateData.slug = slug
        if (description !== undefined) updateData.description = description
        if (logo !== undefined) updateData.logo = logo
        if (settings !== undefined) updateData.settings = settings
        if (is_active !== undefined) updateData.is_active = is_active

        const { data, error } = await supabaseAdmin
            .from('stores')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Store slug already exists' }, { status: 409 })
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update store' }, { status: 500 })
    }
}

// Delete a store
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const { error } = await supabaseAdmin
            .from('stores')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete store' }, { status: 500 })
    }
}
