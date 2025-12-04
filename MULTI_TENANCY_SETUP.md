# Multi-Tenancy Architecture - Setup Guide

## نظام Multi-Tenancy مثل Shopify 🎨

هذا المشروع تم تحويله إلى نظام Multi-Tenancy كامل يسمح بتخصيص الواجهة الأمامية بالكامل مع الحفاظ على الداشبورد والمكونات المشتركة قابلة لإعادة الاستخدام.

---

## 📋 المميزات الرئيسية

### 1. Multi-Tenancy
- كل عميل (Tenant) له بياناته المستقلة
- دعم Subdomain (tenant.mymoments.com)
- دعم Custom Domain (example.com)
- عزل كامل بين البيانات

### 2. Theme System
- نظام ثيمات قابل للتخصيص بالكامل
- تخصيص الألوان، الخطوط، المسافات، والظلال
- معاينة مباشرة للتغييرات
- ثيمات جاهزة (Default, Modern Minimal)

### 3. Reusable Components
- مكتبة مكونات مشتركة
- دعم كامل للثيمات
- مكونات Forms, Buttons, Layout
- قابلة للاستخدام في الداشبورد والواجهة الأمامية

---

## 🚀 Setup Instructions

### 1. Database Migration

قم بتشغيل الـ Migrations بالترتيب:

```bash
# 1. Create tenants table
psql -U your_user -d your_database -f database/migrations/001_tenants_table.sql

# 2. Create themes tables
psql -U your_user -d your_database -f database/migrations/002_themes_tables.sql

# 3. Add tenant_id to existing tables
psql -U your_user -d your_database -f database/migrations/003_add_tenant_id.sql
```

أو استخدم Drizzle:

```bash
# Generate migration
bun run drizzle-kit generate

# Push to database
bun run drizzle-kit push
```

### 2. Environment Variables

أضف المتغيرات التالية إلى `.env.local`:

```env
# Database
DATABASE_URL=your_database_url

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Run Development Server

```bash
bun run dev
```

---

## 📁 Project Structure

```
/home/adam/Videos/mmoments/dashy/
├── app/
│   ├── api/
│   │   ├── themes/              # Theme API routes
│   │   │   ├── tenant/[slug]/   # Get tenant theme
│   │   │   ├── customize/       # Save customizations
│   │   │   └── route.ts         # List themes
│   │   └── tenants/             # Tenant management
│   ├── admin/                   # Admin dashboard
│   └── page.tsx                 # Frontend pages
│
├── components/
│   ├── ui-library/              # Shared components
│   │   ├── forms/               # Input, Textarea, Select
│   │   ├── buttons/             # Button
│   │   ├── layout/              # Container, Stack
│   │   └── README.md            # Component docs
│   ├── admin/                   # Dashboard-only components
│   └── theme-components/        # Customizable frontend components
│
├── lib/
│   └── theme/                   # Theme system
│       ├── types.ts             # TypeScript types
│       ├── ThemeProvider.tsx    # Theme context
│       ├── loader.ts            # Theme utilities
│       └── index.ts
│
├── database/
│   ├── migrations/              # SQL migrations
│   │   ├── 001_tenants_table.sql
│   │   ├── 002_themes_tables.sql
│   │   └── 003_add_tenant_id.sql
│   └── schema.sql               # Original schema
│
├── db/
│   └── schema.ts                # Drizzle schema
│
└── public/
    └── themes/                  # Default theme files
        ├── default.json
        └── modern-minimal.json
```

---

## 🎨 Using the Theme System

### 1. Wrap Your App with ThemeProvider

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/lib/theme';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider initialTheme={defaultTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Use Theme in Components

```tsx
'use client';

import { useTheme } from '@/lib/theme';

export function MyComponent() {
  const { theme, updateCustomization } = useTheme();
  
  const handleColorChange = (color: string) => {
    updateCustomization('colors.primary', color);
  };
  
  return (
    <div style={{ color: theme?.colors.primary }}>
      Content
    </div>
  );
}
```

### 3. Use CSS Variables

```css
.my-element {
  background-color: var(--color-primary);
  color: var(--color-foreground);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

---

## 🧩 Using UI Components

```tsx
import { Input, Button, Stack, Container } from '@/components/ui-library';

function MyForm() {
  return (
    <Container maxWidth="md">
      <Stack spacing="lg">
        <Input
          label="الاسم"
          placeholder="أدخل الاسم"
          required
        />
        
        <Button variant="primary" size="lg">
          حفظ
        </Button>
      </Stack>
    </Container>
  );
}
```

See [Component Documentation](./components/ui-library/README.md) for more details.

---

## 🏢 Creating a New Tenant

### Via SQL:

```sql
INSERT INTO tenants (slug, name, subdomain, plan, status)
VALUES (
  'my-tenant',
  'My Tenant Name',
  'mytenant',
  'premium',
  'active'
);
```

### Via API (Coming Soon):

```typescript
const response = await fetch('/api/tenants', {
  method: 'POST',
  body: JSON.stringify({
    slug: 'my-tenant',
    name: 'My Tenant Name',
    subdomain: 'mytenant',
    plan: 'premium',
  }),
});
```

---

## 🎨 Customizing a Theme

### 1. Via Theme Customization Panel (Coming Soon)

Navigate to `/admin/themes/customize` to use the visual editor.

### 2. Via API:

```typescript
import { saveThemeCustomizations } from '@/lib/theme';

await saveThemeCustomizations({
  tenantId: 'tenant-id',
  themeId: 'theme-id',
  customizations: {
    colors: {
      primary: '#FF0000',
      secondary: '#00FF00',
    },
    typography: {
      fontFamily: {
        primary: 'Cairo, sans-serif',
      },
    },
  },
});
```

---

## 📊 Database Schema

### Main Tables:

1. **tenants** - Tenant information
2. **themes** - Available themes
3. **theme_settings** - Per-tenant customizations
4. **categories** - With tenant_id
5. **services** - With tenant_id
6. **service_images** - With tenant_id

### Relations:

- Tenant → Active Theme (one-to-one)
- Tenant → Theme Settings (one-to-many)
- Tenant → Categories (one-to-many)
- Tenant → Services (one-to-many)

---

## 🔒 Multi-Tenancy Isolation

All queries should filter by `tenant_id`:

```typescript
// Example: Get categories for a tenant
const categories = await db.query.categories.findMany({
  where: eq(categories.tenantId, currentTenantId),
});
```

---

## 🚧 Next Steps

- [ ] Create theme customization panel UI
- [ ] Add tenant management dashboard
- [ ] Implement subdomain routing in middleware
- [ ] Add more UI components (Checkbox, Radio, Modal, etc.)
- [ ] Create theme marketplace
- [ ] Add A/B testing for themes
- [ ] Build visual page builder

---

## 📚 Documentation

- [Implementation Plan](/.gemini/antigravity/brain/0765da0a-a336-49c1-847c-f4b7ae3b573d/implementation_plan.md)
- [Component Library](./components/ui-library/README.md)
- [Task Progress](/.gemini/antigravity/brain/0765da0a-a336-49c1-847c-f4b7ae3b573d/task.md)

---

## 🤝 Contributing

When adding new features:

1. **Always add tenant_id** to new tables
2. **Use UI components** from the library
3. **Support theming** with CSS variables
4. **Document** your changes

---

## 📝 License

Private - All Rights Reserved
