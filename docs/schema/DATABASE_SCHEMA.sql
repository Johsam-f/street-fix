-- Street Fix Database Schema
-- Runs Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 5),
  description TEXT NOT NULL CHECK (char_length(description) >= 10),
  category TEXT NOT NULL CHECK (category IN ('water', 'sanitation', 'waste', 'other')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  latitude DECIMAL(10, 8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude DECIMAL(11, 8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table (communal taps, clinics, waste collection points)
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('water', 'clinic', 'waste_collection', 'other')),
  latitude DECIMAL(10, 8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude DECIMAL(11, 8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  description TEXT,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 5),
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  category TEXT CHECK (category IN ('tips', 'emergency', 'general')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) >= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shoutouts (neighbor appreciation)
CREATE TABLE IF NOT EXISTS shoutouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_name TEXT NOT NULL CHECK (char_length(to_user_name) >= 2),
  message TEXT NOT NULL CHECK (char_length(message) >= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles (optional - extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================

CREATE INDEX IF NOT EXISTS issues_user_id_idx ON issues(user_id);
CREATE INDEX IF NOT EXISTS issues_category_idx ON issues(category);
CREATE INDEX IF NOT EXISTS issues_status_idx ON issues(status);
CREATE INDEX IF NOT EXISTS issues_created_at_idx ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS issues_location_idx ON issues(latitude, longitude);

CREATE INDEX IF NOT EXISTS resources_type_idx ON resources(type);
CREATE INDEX IF NOT EXISTS resources_location_idx ON resources(latitude, longitude);

CREATE INDEX IF NOT EXISTS forum_posts_user_id_idx ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS forum_posts_category_idx ON forum_posts(category);
CREATE INDEX IF NOT EXISTS forum_posts_created_at_idx ON forum_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS forum_replies_post_id_idx ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS forum_replies_user_id_idx ON forum_replies(user_id);

CREATE INDEX IF NOT EXISTS shoutouts_from_user_id_idx ON shoutouts(from_user_id);
CREATE INDEX IF NOT EXISTS shoutouts_created_at_idx ON shoutouts(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoutouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: Issues
-- ============================================

-- Anyone can view issues
CREATE POLICY "Issues are viewable by everyone" 
  ON issues FOR SELECT 
  USING (true);

-- Authenticated users can create issues
CREATE POLICY "Authenticated users can create issues" 
  ON issues FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own issues
CREATE POLICY "Users can update their own issues" 
  ON issues FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins can update any issue
CREATE POLICY "Admins can update any issue" 
  ON issues FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Users can delete their own issues
CREATE POLICY "Users can delete their own issues" 
  ON issues FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: Resources
-- ============================================

-- Anyone can view resources
CREATE POLICY "Resources are viewable by everyone" 
  ON resources FOR SELECT 
  USING (true);

-- Only admins can create resources
CREATE POLICY "Only admins can create resources" 
  ON resources FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Only admins can update resources
CREATE POLICY "Only admins can update resources" 
  ON resources FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Only admins can delete resources
CREATE POLICY "Only admins can delete resources" 
  ON resources FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- ============================================
-- POLICIES: Forum Posts
-- ============================================

-- Anyone can view forum posts
CREATE POLICY "Forum posts are viewable by everyone" 
  ON forum_posts FOR SELECT 
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" 
  ON forum_posts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own posts
CREATE POLICY "Users can update their own posts" 
  ON forum_posts FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts" 
  ON forum_posts FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: Forum Replies
-- ============================================

-- Anyone can view replies
CREATE POLICY "Forum replies are viewable by everyone" 
  ON forum_replies FOR SELECT 
  USING (true);

-- Authenticated users can create replies
CREATE POLICY "Authenticated users can create replies" 
  ON forum_replies FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own replies
CREATE POLICY "Users can update their own replies" 
  ON forum_replies FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own replies
CREATE POLICY "Users can delete their own replies" 
  ON forum_replies FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: Shoutouts
-- ============================================

-- Anyone can view shoutouts
CREATE POLICY "Shoutouts are viewable by everyone" 
  ON shoutouts FOR SELECT 
  USING (true);

-- Authenticated users can create shoutouts
CREATE POLICY "Authenticated users can create shoutouts" 
  ON shoutouts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own shoutouts
CREATE POLICY "Users can delete their own shoutouts" 
  ON shoutouts FOR DELETE 
  USING (auth.uid() = from_user_id);

-- ============================================
-- POLICIES: Profiles
-- ============================================

-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS issues_updated_at ON issues;
CREATE TRIGGER issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS resources_updated_at ON resources;
CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert sample resources (Blantyre locations)
INSERT INTO resources (name, type, latitude, longitude, description, contact) VALUES
  ('Mbayani Communal Tap', 'water', -15.8061, 35.0158, 'Main water point for Mbayani area', '+265 999 123 456'),
  ('Ndirande Health Center', 'clinic', -15.8161, 35.0358, '24/7 emergency services available', '+265 1 876 543'),
  ('Ntopwa Waste Collection Point', 'waste_collection', -15.7961, 35.0258, 'Collection every Monday and Thursday', '+265 888 765 432'),
  ('Chilomoni Borehole', 'water', -15.8261, 35.0458, 'Clean drinking water', '+265 999 888 777'),
  ('Zingwangwa Clinic', 'clinic', -15.7861, 35.0558, 'Basic healthcare services', '+265 1 234 567');

-- ============================================
-- STORAGE BUCKET (Run in Supabase Dashboard)
-- ============================================

-- Create storage bucket for issue photos
-- Go to Storage > Create Bucket
-- Name: issue-photos
-- Public: true

-- Or run this:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('issue-photos', 'issue-photos', true)
ON CONFLICT DO NOTHING;

-- Storage policy: Anyone can view
CREATE POLICY "Anyone can view issue photos" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'issue-photos');

-- Storage policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload photos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'issue-photos' 
    AND auth.role() = 'authenticated'
  );

-- Storage policy: Users can delete their own photos
CREATE POLICY "Users can delete their own photos" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'issue-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- VIEWS (for easier querying)
-- ============================================

-- View: Issues with user info
CREATE OR REPLACE VIEW issues_with_user AS
SELECT 
  i.*,
  p.username,
  p.full_name,
  p.avatar_url
FROM issues i
LEFT JOIN profiles p ON i.user_id = p.id;

-- View: Forum posts with user info and reply count
CREATE OR REPLACE VIEW forum_posts_with_details AS
SELECT 
  fp.*,
  p.username,
  p.full_name,
  p.avatar_url,
  COUNT(fr.id) AS reply_count
FROM forum_posts fp
LEFT JOIN profiles p ON fp.user_id = p.id
LEFT JOIN forum_replies fr ON fp.id = fr.post_id
GROUP BY fp.id, p.username, p.full_name, p.avatar_url;

-- View: Recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  'issue' AS type,
  id,
  title AS content,
  created_at,
  user_id
FROM issues
UNION ALL
SELECT 
  'forum_post' AS type,
  id,
  title AS content,
  created_at,
  user_id
FROM forum_posts
UNION ALL
SELECT 
  'shoutout' AS type,
  id,
  message AS content,
  created_at,
  from_user_id AS user_id
FROM shoutouts
ORDER BY created_at DESC
LIMIT 50;

-- ============================================
-- DONE!
-- ============================================
-- Your database is ready to use!
-- Don't forget to:
-- 1. Copy your Supabase URL and anon key to .env.local
-- 2. Create the storage bucket in the Supabase dashboard
-- 3. Test with sample data
