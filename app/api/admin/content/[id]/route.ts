import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Get single content
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = supabaseAdmin
        const { id } = params

        const { data, error } = await supabase
            .from('dashboard_content')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }
}

// PUT - Update content
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = supabaseAdmin
        const { id } = await params
        const body = await request.json()

        // Extract only allowed fields, excluding id to prevent uuid errors
        const { type, title, description, content, category, display_location, is_active, display_order } = body

        const updateData: Record<string, any> = {
            updated_at: new Date().toISOString()
        }

        // Only include fields that are defined
        if (type !== undefined) updateData.type = type
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (content !== undefined) updateData.content = content
        if (category !== undefined) updateData.category = category
        if (display_location !== undefined) updateData.display_location = display_location
        if (is_active !== undefined) updateData.is_active = is_active
        if (display_order !== undefined) updateData.display_order = display_order

        const { data, error } = await supabase
            .from('dashboard_content')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }
}

// DELETE - Delete content
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = supabaseAdmin
        const { id } = params

        const { error } = await supabase
            .from('dashboard_content')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
    }
}
