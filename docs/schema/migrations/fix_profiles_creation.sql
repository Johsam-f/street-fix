-- Migration: Fix automatic profile creation on user signup
-- This ensures that profiles are created automatically when users sign up

-- ============================================
-- Step 1: Add missing INSERT policy for profiles
-- ============================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Enable insert for authenticated users during sign up" ON profiles;

-- Allow the trigger function to insert profiles
CREATE POLICY "Enable insert for authenticated users during sign up" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- Step 2: Recreate the trigger function (with error handling)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1), -- Use email username part as default username
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent errors if profile already exists
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 3: Ensure the trigger exists
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Step 4: Create profiles for existing users who don't have one
-- ============================================

INSERT INTO public.profiles (id, username, full_name)
SELECT 
  au.id,
  SPLIT_PART(au.email, '@', 1),
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1))
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- COMPLETE
-- ============================================
-- Run this migration in Supabase SQL Editor to fix profile creation
