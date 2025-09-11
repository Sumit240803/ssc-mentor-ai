-- Fix Security Definer View issues by setting security_invoker = true
-- This ensures views use the querying user's permissions and RLS policies

-- Set security_invoker for all views to fix Security Definer View linter errors
ALTER VIEW public.chat_conversations_with_context SET (security_invoker = true);
ALTER VIEW public.chat_sessions_with_profile SET (security_invoker = true);
ALTER VIEW public.content_with_summaries SET (security_invoker = true);
ALTER VIEW public.summary_statistics SET (security_invoker = true);
ALTER VIEW public.user_activity_stats SET (security_invoker = true);