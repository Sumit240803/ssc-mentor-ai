-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create lectures table
CREATE TABLE public.lectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    video_url TEXT,
    thumbnail_url TEXT,
    difficulty_level TEXT DEFAULT 'beginner',
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on lectures
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Create subjects table for better organization
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_code TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'BookOpen',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Insert default subjects
INSERT INTO public.subjects (name, description, color_code, icon) VALUES
('General Studies', 'History, Geography, Polity, Economics', '#3B82F6', 'BookOpen'),
('Mathematics', 'Arithmetic, Algebra, Geometry', '#10B981', 'Calculator'),
('Reasoning', 'Logical and Analytical Reasoning', '#8B5CF6', 'Brain'),
('English', 'Grammar, Vocabulary, Comprehension', '#F59E0B', 'Languages'),
('Current Affairs', 'Recent Events and News', '#EF4444', 'Newspaper');

-- RLS Policies for lectures (admins can do everything, users can only read published)
CREATE POLICY "Admins can manage all lectures"
ON public.lectures
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view published lectures"
ON public.lectures
FOR SELECT
TO authenticated
USING (is_published = true);

-- RLS Policies for subjects
CREATE POLICY "Admins can manage subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view active subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS Policies for user_roles (only admins can manage roles)
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create trigger for updating timestamps
CREATE TRIGGER update_lectures_updated_at
BEFORE UPDATE ON public.lectures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get user stats for admin dashboard
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_profiles', (SELECT COUNT(*) FROM public.profiles),
    'total_posts', (SELECT COUNT(*) FROM public.posts),
    'total_lectures', (SELECT COUNT(*) FROM public.lectures),
    'published_lectures', (SELECT COUNT(*) FROM public.lectures WHERE is_published = true),
    'total_subjects', (SELECT COUNT(*) FROM public.subjects WHERE is_active = true),
    'recent_signups', (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '7 days')
  );
$$;