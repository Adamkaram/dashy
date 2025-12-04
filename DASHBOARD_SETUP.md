# 🚀 Dashboard Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account
- Basic knowledge of Next.js

## Step-by-Step Setup

### 1. Install Dependencies
```bash
bun add @supabase/supabase-js better-auth pg
bun add -D @types/pg
```

### 2. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `sarainah`
   - Database Password: (save this!)
   - Region: Choose closest to Kuwait
4. Wait for project to be ready (~2 minutes)

### 3. Get Supabase Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (⚠️ Keep this secret!)

### 4. Setup Database
1. Go to SQL Editor in Supabase Dashboard
2. Open `/database/schema.sql` from this project
3. Copy and paste the entire content
4. Click "Run" to execute
5. Verify tables are created in Table Editor

### 5. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
```

### 6. Setup Better Auth Tables
Better Auth will automatically create its tables on first run. Just make sure your DATABASE_URL is correct.

### 7. Create First Admin User
Run this SQL in Supabase SQL Editor:
```sql
-- This will be automated via the dashboard later
-- For now, create manually after first signup
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-email@example.com';
```

### 8. Run Development Server
```bash
bun run dev
```

### 9. Access Dashboard
- Frontend: http://localhost:3000
- Dashboard: http://localhost:3000/admin (after login)

## 🔐 Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Keep `service_role` key secret
- [ ] Enable RLS (Row Level Security) in production
- [ ] Use strong passwords for admin accounts
- [ ] Enable email verification in production
- [ ] Set up proper CORS origins

## 📊 Dashboard Features

### Implemented:
- ✅ Categories Management (CRUD)
- ✅ Services Management (CRUD)
- ✅ Hero Slides Management
- ✅ Site Settings
- ✅ Navigation Links
- ✅ Social Links
- ✅ Kuwait Areas

### Coming Soon:
- 🔄 Bookings Management
- 🔄 User Management
- 🔄 Analytics Dashboard
- 🔄 File Upload to Supabase Storage

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Connection refused
```
**Solution**: Check your DATABASE_URL format and password

### Auth Not Working
```
Error: Invalid JWT
```
**Solution**: Regenerate BETTER_AUTH_SECRET and restart server

### Tables Not Found
```
Error: relation "categories" does not exist
```
**Solution**: Run schema.sql again in Supabase SQL Editor

## 📚 Resources

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 🆘 Need Help?

Check the logs:
```bash
# Supabase logs
# Go to Supabase Dashboard → Logs

# App logs
# Check terminal where `bun run dev` is running
```
