-- Fix chat data security issue by enabling RLS and adding policies
-- This ensures users can only access their own chat conversations and sessions

-- Enable RLS on chat_conversations table
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on chat_sessions table  
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for chat_conversations
-- Users can view their own conversations
CREATE POLICY "Users can view their own chat conversations"
ON public.chat_conversations
FOR SELECT 
USING (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Users can insert their own conversations
CREATE POLICY "Users can insert their own chat conversations"
ON public.chat_conversations
FOR INSERT 
WITH CHECK (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Users can update their own conversations
CREATE POLICY "Users can update their own chat conversations"
ON public.chat_conversations
FOR UPDATE 
USING (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Add RLS policies for chat_sessions
-- Users can view their own sessions
CREATE POLICY "Users can view their own chat sessions"
ON public.chat_sessions
FOR SELECT 
USING (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Users can insert their own sessions
CREATE POLICY "Users can insert their own chat sessions"
ON public.chat_sessions
FOR INSERT 
WITH CHECK (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Users can update their own sessions
CREATE POLICY "Users can update their own chat sessions"
ON public.chat_sessions
FOR UPDATE 
USING (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Admins can manage all chat data
CREATE POLICY "Admins can manage all chat conversations"
ON public.chat_conversations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all chat sessions"
ON public.chat_sessions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));