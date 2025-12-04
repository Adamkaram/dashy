# Sarainah Database Documentation

## 📋 Overview
This directory contains all database-related files for the Sarainah project, including SQL schemas, migrations, and documentation.

## 🗂️ Database Structure

### Tables

#### 1. **site_settings**
Stores global site configuration
- `id` (UUID): Primary key
- `name`: Site name
- `logo`: Logo path
- `description`: Site description
- `copyright`: Copyright text
- `powered_by`: Powered by text

#### 2. **hero_slides**
Homepage hero carousel slides
- `id` (SERIAL): Primary key
- `image`: Image URL
- `title`: Slide title
- `subtitle`: Slide subtitle
- `display_order`: Order of display
- `is_active`: Active status

#### 3. **categories**
Service categories
- `id` (VARCHAR): Category ID
- `name`: Category name
- `description`: Category description
- `display_order`: Display order
- `is_active`: Active status

#### 4. **services**
Individual services
- `id` (VARCHAR): Service ID
- `category_id`: Foreign key to categories
- `title`: Service title
- `subtitle`: Service subtitle
- `image`: Main image URL
- `description`: Service description
- `base_price`: Base price
- `is_active`: Active status

#### 5. **subcategories**
Subcategories for services
- `id` (VARCHAR): Subcategory ID
- `category_id`: Foreign key to categories
- `name`: Subcategory name
- `image`: Image URL
- `is_active`: Active status

#### 6. **service_images**
Multiple images for each service
- `id` (UUID): Primary key
- `service_id`: Foreign key to services
- `image_url`: Image URL
- `display_order`: Display order

#### 7. **navigation_links**
Navigation menu links
- `id` (UUID): Primary key
- `label`: Link label
- `href`: Link URL
- `type`: 'main' or 'footer'
- `display_order`: Display order
- `is_active`: Active status

#### 8. **social_links**
Social media links
- `id` (UUID): Primary key
- `platform`: Platform name (instagram, facebook, etc.)
- `url`: Social media URL
- `label`: Display label
- `is_active`: Active status

#### 9. **kuwait_areas**
Kuwait governorates and areas
- `id` (UUID): Primary key
- `governorate`: Governorate name
- `area_name`: Area name
- `display_order`: Display order
- `is_active`: Active status

## 🚀 Setup Instructions

### 1. Create Supabase Project
```bash
# Go to https://supabase.com
# Create a new project
# Note your project URL and anon key
```

### 2. Run Schema
```bash
# Option 1: Using Supabase Dashboard
# - Go to SQL Editor
# - Paste contents of schema.sql
# - Run the query

# Option 2: Using Supabase CLI
supabase db push
```

### 3. Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Relationships

```
categories
    ├── services (many)
    └── subcategories (many)

services
    ├── service_images (many)
    └── belongs to category (one)

subcategories
    └── belongs to category (one)
```

## 🔐 Security

### Row Level Security (RLS)
RLS is commented out in the schema. Enable it for production:

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies as needed
CREATE POLICY "Public read access" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admin write access" ON categories
    FOR ALL USING (auth.role() = 'admin');
```

## 🔄 Migrations

Future migrations should be added to the `migrations/` directory with the following naming convention:
```
YYYYMMDD_HHMMSS_description.sql
```

Example:
```
20251126_120000_add_booking_table.sql
```

## 📝 Notes

- All tables have `created_at` and `updated_at` timestamps
- `updated_at` is automatically updated via triggers
- Indexes are created for foreign keys and frequently queried columns
- UUID extension is enabled for generating UUIDs

## 🛠️ Maintenance

### Backup
```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

### Restore
```bash
# Using Supabase CLI
supabase db reset
psql -f backup.sql
```

## 📞 Support

For database-related issues, check:
1. Supabase Dashboard logs
2. SQL Editor for query testing
3. Table Editor for data inspection
