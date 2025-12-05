# شرح جداول Multi-Tenancy System

## نظرة عامة

في نظام Multi-Tenancy، نحتاج لثلاث جداول رئيسية:
1. **tenants** - بيانات المستأجرين
2. **themes** - الثيمات المتاحة
3. **theme_settings** - ربط المستأجر بالثيم + التخصيصات

---

## 1️⃣ جدول `tenants` (المستأجرين)

### الغرض
يحتوي على بيانات كل مستأجر (عميل/موقع منفصل)

### الأعمدة الحالية
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  slug VARCHAR(100) UNIQUE,           -- معرّف فريد (مثل: 'default', 'tenant1')
  name VARCHAR(255),                  -- اسم المستأجر (مثل: 'ماى مومنت')
  domain VARCHAR(255) UNIQUE,         -- النطاق الكامل (مثل: 'mymoments.com')
  subdomain VARCHAR(100) UNIQUE,      -- النطاق الفرعي (مثل: 'www', 'tenant1')
  plan VARCHAR(50),                   -- الخطة (free, premium, enterprise)
  status VARCHAR(50),                 -- الحالة (active, suspended, trial)
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### ✅ التعديل المقترح: إضافة `active_theme_id`

**المشكلة الحالية:**
- لا يوجد عمود يحدد الثيم النشط مباشرة
- نضطر للبحث في `theme_settings` في كل مرة

**الحل:**
```sql
ALTER TABLE tenants 
ADD COLUMN active_theme_id UUID REFERENCES themes(id);
```

**الفائدة:**
- سرعة في جلب الثيم النشط
- استعلام واحد بدلاً من اثنين
- وضوح أكثر في البيانات

### مثال بيانات
```json
{
  "id": "uuid-1",
  "slug": "default",
  "name": "ماى مومنت - الموقع الرئيسي",
  "domain": "mymoments.com",
  "subdomain": "www",
  "active_theme_id": "theme-uuid-1",  // ← الثيم النشط
  "plan": "premium",
  "status": "active"
}
```

---

## 2️⃣ جدول `themes` (الثيمات)

### الغرض
يحتوي على الثيمات المتاحة في النظام (مثل: Default, Modern Minimal, Elegant)

### الأعمدة الحالية
```sql
CREATE TABLE themes (
  id UUID PRIMARY KEY,
  name VARCHAR(255),                  -- اسم الثيم في الكود (مثل: 'default', 'elegant')
  slug VARCHAR(100) UNIQUE,           -- معرّف فريد
  description TEXT,                   -- وصف الثيم
  type VARCHAR(50),                   -- نوع الثيم (custom, marketplace, system)
  is_public BOOLEAN,                  -- هل متاح في الـ marketplace؟
  is_active BOOLEAN,                  -- ⚠️ غير واضح الاستخدام
  preview_image TEXT,                 -- صورة معاينة
  demo_url TEXT,                      -- رابط تجريبي
  config JSONB,                       -- إعدادات الثيم (ألوان، خطوط، إلخ)
  created_by UUID,                    -- من أنشأ الثيم (tenant)
  price DECIMAL,                      -- السعر (للثيمات المدفوعة)
  currency VARCHAR(3),
  version VARCHAR(20),
  tags TEXT[],
  downloads INTEGER,
  rating DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### ⚠️ المشكلة: `is_active` مش واضح

**السؤال:** `is_active` هنا معناه إيه؟
- هل الثيم متاح للاستخدام؟
- ولا الثيم نشط لمستأجر معين؟

**الإجابة:** 
- `is_active` في جدول `themes` يجب أن يعني: **هل الثيم متاح للاستخدام/الشراء؟**
- أما "هل الثيم نشط لمستأجر معين" فده يتحدد من `tenants.active_theme_id`

### ✅ التعديل المقترح

**إعادة تسمية للوضوح:**
```sql
ALTER TABLE themes 
RENAME COLUMN is_active TO is_available;
```

**أو إزالته تماماً إذا كان غير مستخدم:**
```sql
ALTER TABLE themes 
DROP COLUMN is_active;
```

### مثال بيانات
```json
{
  "id": "theme-uuid-1",
  "name": "default",
  "slug": "default-theme",
  "description": "الثيم الافتراضي بتصميم سرينا الأنيق",
  "type": "system",
  "is_available": true,  // ← متاح للاستخدام
  "preview_image": "/themes/default/preview.jpg",
  "config": {
    "colors": {
      "primary": "#53131C",
      "secondary": "#8F6B43"
    },
    "fonts": {
      "heading": "Cairo",
      "body": "Tajawal"
    }
  },
  "created_by": null,  // system theme
  "price": 0,
  "version": "1.0.0"
}
```

---

## 3️⃣ جدول `theme_settings` (التخصيصات)

### الغرض الحالي
يربط المستأجر بالثيم + يحفظ التخصيصات الخاصة به

### الأعمدة الحالية
```sql
CREATE TABLE theme_settings (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  theme_id UUID REFERENCES themes(id),
  customizations JSONB,               -- تخصيصات الألوان/الخطوط
  layout_config JSONB,                -- إعدادات الـ layout
  active_sections JSONB,              -- الأقسام النشطة
  section_order JSONB,                -- ترتيب الأقسام
  custom_css TEXT,                    -- CSS مخصص
  custom_js TEXT,                     -- JavaScript مخصص
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 🤔 السؤال: هل نحتاج `theme_settings`؟

**الإجابة: نعم ولا!**

#### ✅ نحتاجه إذا:
1. **المستأجر يقدر يخصص الثيم**
   - مثلاً: يغير الألوان، الخطوط، الـ layout
   - كل مستأجر عنده نسخته الخاصة من الثيم

2. **مثال:**
   - Tenant A يستخدم "Default Theme" بألوان حمراء
   - Tenant B يستخدم "Default Theme" بألوان زرقاء
   - نفس الثيم، تخصيصات مختلفة

#### ❌ لا نحتاجه إذا:
1. **المستأجر بس يختار ثيم جاهز**
   - بدون تخصيص
   - كل ثيم له ألوانه وإعداداته الثابتة

2. **في الحالة دي:**
   - نكتفي بـ `tenants.active_theme_id`
   - نحذف جدول `theme_settings` تماماً

---

## 🎯 التوصية النهائية

### السيناريو 1️⃣: بدون تخصيص (أبسط)

**الجداول المطلوبة:**
- `tenants` (مع `active_theme_id`)
- `themes`

**التعديلات:**
```sql
-- 1. إضافة active_theme_id للـ tenants
ALTER TABLE tenants 
ADD COLUMN active_theme_id UUID REFERENCES themes(id);

-- 2. حذف theme_settings (غير مطلوب)
DROP TABLE theme_settings;

-- 3. إعادة تسمية is_active في themes
ALTER TABLE themes 
RENAME COLUMN is_active TO is_available;
```

**الاستعلام:**
```typescript
// جلب المستأجر مع الثيم النشط
const tenant = await db.query.tenants.findFirst({
  where: eq(tenants.slug, 'default'),
  with: {
    activeTheme: true  // علاقة مباشرة
  }
});

const themeName = tenant.activeTheme?.name || 'default';
```

**الفوائد:**
- ✅ بسيط وواضح
- ✅ سريع (استعلام واحد)
- ✅ سهل الصيانة

---

### السيناريو 2️⃣: مع تخصيص (أكثر مرونة)

**الجداول المطلوبة:**
- `tenants`
- `themes`
- `theme_settings`

**التعديلات:**
```sql
-- 1. إضافة unique constraint على theme_settings
ALTER TABLE theme_settings 
ADD CONSTRAINT unique_tenant_theme UNIQUE (tenant_id);

-- 2. إعادة تسمية is_active في themes
ALTER TABLE themes 
RENAME COLUMN is_active TO is_available;
```

**ملاحظة:** كل مستأجر له `theme_setting` واحد فقط (الثيم النشط + تخصيصاته)

**الاستعلام:**
```typescript
// جلب المستأجر مع الثيم والتخصيصات
const tenant = await db.query.tenants.findFirst({
  where: eq(tenants.slug, 'default')
});

const themeSetting = await db.query.themeSettings.findFirst({
  where: eq(themeSettings.tenantId, tenant.id),
  with: {
    theme: true
  }
});

const themeName = themeSetting?.theme?.name || 'default';
const customColors = themeSetting?.customizations?.colors;
```

**الفوائد:**
- ✅ مرونة كاملة في التخصيص
- ✅ كل مستأجر له نسخته من الثيم
- ✅ يدعم CSS/JS مخصص

**العيوب:**
- ⚠️ أكثر تعقيداً
- ⚠️ استعلامات إضافية

---

## 📊 مقارنة السيناريوهات

| الميزة | بدون تخصيص | مع تخصيص |
|--------|------------|----------|
| **البساطة** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **السرعة** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **المرونة** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **الجداول** | 2 | 3 |
| **الاستعلامات** | 1 | 2 |

---

## 🎨 أمثلة عملية

### مثال 1: مستأجر يستخدم ثيم جاهز (بدون تخصيص)

```typescript
// Tenant: ماى مومنت
{
  id: "tenant-1",
  slug: "default",
  name: "ماى مومنت",
  active_theme_id: "theme-default"  // ← يستخدم Default Theme
}

// Theme: Default
{
  id: "theme-default",
  name: "default",
  config: {
    colors: { primary: "#53131C" }
  }
}

// النتيجة: يظهر الموقع بألوان Default Theme الثابتة
```

### مثال 2: مستأجر يخصص الثيم (مع تخصيص)

```typescript
// Tenant: مستأجر مخصص
{
  id: "tenant-2",
  slug: "custom-tenant"
}

// Theme Setting
{
  tenant_id: "tenant-2",
  theme_id: "theme-default",
  customizations: {
    colors: {
      primary: "#FF0000"  // ← غيّر اللون الأساسي
    }
  }
}

// النتيجة: نفس Default Theme لكن بلون أحمر
```

---

## ✅ التوصية النهائية لمشروعك

**أنصحك بـ السيناريو 1 (بدون تخصيص)** لأن:

1. ✅ **أبسط وأسرع** - مناسب للبداية
2. ✅ **سهل الصيانة** - جدولين فقط
3. ✅ **يكفي احتياجاتك الحالية** - اختيار ثيم جاهز
4. ✅ **يمكن الترقية لاحقاً** - إضافة `theme_settings` بسهولة

**الخطوات:**
1. إضافة `active_theme_id` لجدول `tenants`
2. حذف `is_active` من `themes` (أو إعادة تسميته)
3. حذف جدول `theme_settings` (أو تركه للمستقبل)

**هل توافق على هذا النهج؟** 🚀
