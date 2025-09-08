import { useState, useEffect } from 'react';

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
        const response = await fetch(`https://study-ai-rohit.vercel.app/api/v1/topics/${contentId}/summary`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        
        const data: SummaryResponse = await response.json();
        setSummary(data);
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