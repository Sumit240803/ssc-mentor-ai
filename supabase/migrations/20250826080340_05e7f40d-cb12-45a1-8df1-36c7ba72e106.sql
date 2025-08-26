-- Fix search_path for has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix search_path for get_admin_stats function
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
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