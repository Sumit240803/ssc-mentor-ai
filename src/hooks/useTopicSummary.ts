import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopicInfo {
  filename: string;
  subject: string;
  sub_subject: string;
  topic: string;
  subtopic: string;
}

interface SummaryResponse {
  status: string;
  content_id: string;
  topic_info: TopicInfo;
  enhanced_summary: string;
  file_size: number;
  created_at: string;
  message: string;
}

export const useTopicSummary = (contentId: string | null) => {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentId) {
      setSummary(null);
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from Supabase content_with_summaries view
        const { data, error: dbError } = await supabase
          .from('content_with_summaries')
          .select('*')
          .eq('content_id', contentId)
          .single();
        
        if (dbError) {
          throw dbError;
        }

        if (!data) {
          throw new Error('Summary not found');
        }
        
        // Transform data to match expected format
        const transformedData: SummaryResponse = {
          status: 'success',
          content_id: data.content_id || '',
          topic_info: {
            filename: data.filename || '',
            subject: data.subject || '',
            sub_subject: data.sub_subject || '',
            topic: data.topic || '',
            subtopic: data.subtopic || ''
          },
          enhanced_summary: data.enhanced_summary || data.standard_summary || '',
          file_size: data.file_size || 0,
          created_at: data.created_at || new Date().toISOString(),
          message: 'Summary retrieved successfully'
        };
        
        setSummary(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [contentId]);

  return { summary, loading, error };
};