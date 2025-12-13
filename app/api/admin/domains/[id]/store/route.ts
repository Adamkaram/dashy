import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// PUT - Link domain to store
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { store_id } = body;

        if (!store_id) {
            return NextResponse.json(
                { error: 'store_id is required' },
                { status: 400 }
            );
        }

        // Verify the store exists
        const { data: store, error: storeError } = await supabaseAdmin
            .from('stores')
            .select('id, name')
            .eq('id', store_id)
            .single();

        if (storeError || !store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        // Update the domain with the store_id
        const { data, error } = await supabaseAdmin
            .from('domains')
            .update({
                store_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ...data,
            store_name: store.name
        });
    } catch (error: any) {
        console.error('Error linking domain to store:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to link domain to store' },
            { status: 500 }
        );
    }
}
