-- =====================================================
-- Create Admin User
-- =====================================================
-- This script creates the first admin user
-- Email: Ather@gmail.com
-- Password: ahmad@#$98AA
-- =====================================================

-- Note: Better Auth will handle user creation
-- This is a placeholder for reference

-- After running the app and signing up with Better Auth,
-- run this query to make the user an admin:

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'ahmadkarm4322@gmail.com';

-- Verify the update
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'ahmadkarm4322@gmail.com';
