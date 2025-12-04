# 🎛️ Sarainah Admin Dashboard

## ✅ ما تم إنجازه

### 1. **Database Schema** (UUID-based)
- ✅ جداول ديناميكية مع UUID
- ✅ Slugs للـ URLs
- ✅ Schema SQL محفوظ في `/database/schema.sql`
- ✅ Seed script في `/database/seed.sql`

### 2. **Authentication (Better Auth)**
- ✅ صفحة تسجيل الدخول `/login`
- ✅ API Routes: `/api/auth/login` & `/api/auth/logout`
- ✅ Middleware لحماية `/admin/*`
- ✅ Role-based access (user, admin, super-admin)

### 3. **Dashboard UI**
- ✅ Layout مع Sidebar
- ✅ صفحة رئيسية مع إحصائيات
- ✅ إدارة التصنيفات (CRUD كامل)
- ✅ RTL Support
- ✅ Responsive Design

### 4. **API Routes**
- ✅ `/api/admin/categories` - GET, POST
- ✅ `/api/admin/categories/[id]` - GET, PUT, DELETE

## 📁 هيكل الملفات

```
mymoments/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Dashboard Layout
│   │   ├── page.tsx            # Dashboard Home
│   │   └── categories/
│   │       ├── page.tsx        # Categories List
│   │       ├── new/
│   │       │   └── page.tsx    # Create Category (TODO)
│   │       └── [id]/
│   │           └── page.tsx    # Edit Category (TODO)
│   ├── login/
│   │   └── page.tsx            # Login Page
│   └── api/
│       └── admin/
│           └── categories/
│               ├── route.ts    # List & Create
│               └── [id]/
│                   └── route.ts # Get, Update, Delete
├── lib/
│   ├── auth.ts                 # Better Auth Config
│   └── supabase.ts             # Supabase Client
├── database/
│   ├── schema.sql              # Database Schema
│   ├── seed.sql                # Seed Data
│   └── README.md               # Database Docs
├── middleware.ts               # Route Protection
└── .env.example                # Environment Template
```

## 🚀 الخطوات التالية

### 1. إعداد Supabase
```bash
# 1. إنشاء مشروع في Supabase
# 2. تشغيل schema.sql في SQL Editor
# 3. تشغيل seed.sql لإدخال البيانات
# 4. نسخ credentials إلى .env.local
```

### 2. تكوين Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000
```

### 3. إنشاء أول مستخدم Admin
```sql
-- في Supabase SQL Editor
-- بعد التسجيل من واجهة Better Auth
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-email@example.com';
```

### 4. تشغيل المشروع
```bash
bun run dev
```

## 📋 الصفحات المتبقية (TODO)

### Categories
- [ ] `/admin/categories/new` - إضافة تصنيف جديد
- [ ] `/admin/categories/[id]` - تعديل تصنيف

### Services
- [ ] `/admin/services` - قائمة الخدمات
- [ ] `/admin/services/new` - إضافة خدمة
- [ ] `/admin/services/[id]` - تعديل خدمة
- [ ] API Routes للخدمات

### Hero Slides
- [ ] `/admin/hero-slides` - قائمة الشرائح
- [ ] `/admin/hero-slides/new` - إضافة شريحة
- [ ] `/admin/hero-slides/[id]` - تعديل شريحة
- [ ] API Routes للشرائح

### Settings
- [ ] `/admin/settings` - إعدادات الموقع
- [ ] Navigation Links
- [ ] Social Links
- [ ] Site Settings

### Additional Features
- [ ] Image Upload (Supabase Storage)
- [ ] Bulk Actions
- [ ] Search & Filters
- [ ] Pagination
- [ ] User Management
- [ ] Activity Logs

## 🎨 التصميم

- **الألوان الرئيسية:**
  - Primary: `#53131C` (Burgundy)
  - Secondary: `#8F6B43` (Brown Gold)
  - Background: `#F0EBE5` (Beige)
  
- **الخط:** Ithra-Bold

## 🔐 الأمان

- ✅ Middleware protection
- ✅ Better Auth sessions
- ⚠️ TODO: RLS في Supabase
- ⚠️ TODO: CSRF protection
- ⚠️ TODO: Rate limiting

## 📚 الموارد

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🐛 المشاكل المعروفة

1. **Better Auth Tables**: ستُنشأ تلقائياً عند أول تشغيل
2. **Session Verification**: يحتاج تحسين في Middleware
3. **File Upload**: غير مُنفذ بعد

## 💡 نصائح

- استخدم Supabase Dashboard لمراقبة الـ logs
- فعّل RLS قبل Production
- احفظ نسخة احتياطية من الـ database بانتظام
- استخدم Environment Variables للـ secrets

---

**تم إنشاؤه بواسطة:** Antigravity AI  
**التاريخ:** 2025-11-26
