-- Create tasks table for schedule management
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  scheduled_time time,
  duration_minutes integer DEFAULT 30,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_completed boolean DEFAULT false,
  scheduled_date date DEFAULT CURRENT_DATE,
  user_id uuid,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create motivational_content table
CREATE TABLE public.motivational_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  content text NOT NULL,
  author text,
  type text DEFAULT 'quote' CHECK (type IN ('quote', 'tip', 'success', 'article')),
  category text DEFAULT 'General',
  is_daily boolean DEFAULT false,
  is_active boolean DEFAULT true,
  likes_count integer DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_stats table for progress tracking
CREATE TABLE public.user_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  study_hours_total integer DEFAULT 0,
  lectures_completed integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  tasks_completed_today integer DEFAULT 0,
  motivation_score integer DEFAULT 80,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_content ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tasks" 
ON public.tasks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for motivational_content
CREATE POLICY "Users can view active motivational content" 
ON public.motivational_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage motivational content" 
ON public.motivational_content 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all stats" 
ON public.user_stats 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_motivational_content_updated_at
BEFORE UPDATE ON public.motivational_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();