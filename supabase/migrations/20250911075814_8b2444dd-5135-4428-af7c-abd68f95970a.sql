-- Fix Security Definer View issues by recreating views without SECURITY DEFINER
-- This ensures views use the querying user's permissions and RLS policies

-- Drop and recreate chat_conversations_with_context view
DROP VIEW IF EXISTS public.chat_conversations_with_context;
CREATE VIEW public.chat_conversations_with_context AS
SELECT 
    cc.id,
    cc.session_id,
    cc.profile_id,
    cc.content_id,
    cc.message_type,
    cc.message_text,
    cc.message_context,
    cc.model_used,
    cc.prompt_tokens,
    cc.completion_tokens,
    cc.total_tokens,
    cc.response_time_ms,
    cc.user_rating,
    cc.was_helpful,
    cc.created_at,
    cc.message_order,
    p.user_id,
    p.full_name,
    cs.session_name,
    cs.session_type,
    cs.topic_context,
    sc.filename AS content_filename,
    s.subject,
    s.sub_subject,
    s.topic,
    s.subtopic
FROM chat_conversations cc
JOIN profiles p ON cc.profile_id = p.id
JOIN chat_sessions cs ON cc.session_id = cs.id
LEFT JOIN study_content sc ON cc.content_id = sc.id
LEFT JOIN subjects s ON sc.subject_id = s.id;

-- Drop and recreate chat_sessions_with_profile view
DROP VIEW IF EXISTS public.chat_sessions_with_profile;
CREATE VIEW public.chat_sessions_with_profile AS
SELECT 
    cs.id,
    cs.session_id,
    cs.profile_id,
    cs.content_id,
    cs.session_name,
    cs.session_type,
    cs.topic_context,
    cs.message_count,
    cs.total_response_time_ms,
    cs.avg_response_time_ms,
    cs.is_active,
    cs.ended_at,
    cs.created_at,
    cs.updated_at,
    p.user_id,
    p.full_name,
    p.email,
    p.exam_type,
    p.study_streak,
    sc.filename AS content_filename,
    s.subject,
    s.sub_subject,
    s.topic,
    s.subtopic
FROM chat_sessions cs
JOIN profiles p ON cs.profile_id = p.id
LEFT JOIN study_content sc ON cs.content_id = sc.id
LEFT JOIN subjects s ON sc.subject_id = s.id;

-- Drop and recreate content_with_summaries view
DROP VIEW IF EXISTS public.content_with_summaries;
CREATE VIEW public.content_with_summaries AS
SELECT 
    sc.id AS content_id,
    sc.filename,
    sc.file_path,
    sc.storage_url,
    sc.file_size,
    sc.page_count,
    sc.formatted_content,
    sc.content_length,
    sc.processing_status,
    sc.processed_at,
    s.subject,
    s.sub_subject,
    s.topic,
    s.subtopic,
    cs_standard.summary_text AS standard_summary,
    cs_standard.generated_at AS standard_summary_date,
    cs_enhanced.summary_text AS enhanced_summary,
    cs_enhanced.generated_at AS enhanced_summary_date,
    sc.created_at,
    sc.updated_at
FROM study_content sc
JOIN subjects s ON sc.subject_id = s.id
LEFT JOIN content_summaries cs_standard ON sc.id = cs_standard.content_id 
    AND cs_standard.summary_type = 'standard'
LEFT JOIN content_summaries cs_enhanced ON sc.id = cs_enhanced.content_id 
    AND cs_enhanced.summary_type = 'enhanced';

-- Drop and recreate summary_statistics view
DROP VIEW IF EXISTS public.summary_statistics;
CREATE VIEW public.summary_statistics AS
SELECT 
    s.subject,
    s.sub_subject,
    COUNT(sc.id) AS total_content,
    COUNT(cs_standard.id) AS standard_summaries,
    COUNT(cs_enhanced.id) AS enhanced_summaries,
    AVG(cs_standard.compression_ratio) AS avg_standard_compression,
    AVG(cs_enhanced.compression_ratio) AS avg_enhanced_compression,
    AVG(sc.content_length) AS avg_content_length
FROM subjects s
LEFT JOIN study_content sc ON s.id = sc.subject_id
LEFT JOIN content_summaries cs_standard ON sc.id = cs_standard.content_id 
    AND cs_standard.summary_type = 'standard'
LEFT JOIN content_summaries cs_enhanced ON sc.id = cs_enhanced.content_id 
    AND cs_enhanced.summary_type = 'enhanced'
GROUP BY s.subject, s.sub_subject;

-- Drop and recreate user_activity_stats view
DROP VIEW IF EXISTS public.user_activity_stats;
CREATE VIEW public.user_activity_stats AS
SELECT 
    p.id AS profile_id,
    p.user_id,
    p.full_name,
    p.study_streak,
    p.total_sessions,
    COUNT(DISTINCT cs.id) AS chat_sessions_count,
    COUNT(cc.id) AS total_messages,
    COUNT(CASE WHEN cc.message_type = 'user' THEN 1 END) AS user_messages,
    COUNT(CASE WHEN cc.message_type = 'assistant' THEN 1 END) AS ai_responses,
    AVG(cc.response_time_ms) AS avg_response_time,
    MAX(cs.created_at) AS last_chat_session,
    COUNT(CASE WHEN cc.user_rating >= 4 THEN 1 END) AS positive_ratings
FROM profiles p
LEFT JOIN chat_sessions cs ON p.id = cs.profile_id
LEFT JOIN chat_conversations cc ON cs.id = cc.session_id
GROUP BY p.id, p.user_id, p.full_name, p.study_streak, p.total_sessions;