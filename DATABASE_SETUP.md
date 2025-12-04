# تعليمات إعداد قاعدة البيانات

## الطريقة 1: من خلال Supabase Dashboard (موصى بها)

1. افتح الرابط: https://supabase.com/dashboard/project/wgbbwrstcsizaqmvykmh/sql/new
2. سجل الدخول إذا لم تكن مسجلاً
3. انسخ محتوى ملف `database/schema.sql`
4. الصقه في SQL Editor
5. اضغط "Run" أو Ctrl+Enter
6. انتظر حتى ينتهي التنفيذ (قد يستغرق دقيقة)

## الطريقة 2: من خلال Terminal (إذا كان Supabase CLI مثبت)

```bash
# إذا لم يكن مثبت
npm install -g supabase

# ثم شغل
supabase db push
```

## بعد تشغيل الـ Schema:

شغل الأمر التالي للتأكد من إضافة التصنيفات:

```bash
bun run scripts/seed-categories.ts
```

## التحقق من النجاح:

افتح الرابط: http://localhost:3000/api/admin/categories

يجب أن ترى قائمة بالتصنيفات بصيغة JSON.
