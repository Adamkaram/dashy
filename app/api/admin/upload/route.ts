import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        console.log('Upload API called');
        console.log('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'الملف مطلوب' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'نوع الملف غير مدعوم. الأنواع المدعومة: JPEG, PNG, WebP' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'حجم الملف كبير جداً. الحد الأقصى 5MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${randomString}.${extension}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from('moment-bucket')
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('moment-bucket')
            .getPublicUrl(filename);

        return NextResponse.json({
            url: publicUrl,
            filename: filename,
            size: file.size,
            type: file.type,
        });
    } catch (error: any) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في رفع الصورة' },
            { status: 500 }
        );
    }
}

// DELETE image
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json(
                { error: 'اسم الملف مطلوب' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin.storage
            .from('moment-bucket')
            .remove([filename]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: error.message || 'فشل في حذف الصورة' },
            { status: 500 }
        );
    }
}
