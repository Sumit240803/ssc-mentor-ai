import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopicInfo {
  subject: string;
  sub_subject: string;
  topic: string;
  subtopic: string;
  filename: string;
}

interface TopicData {
  content_id: string;
  topic_info: TopicInfo;
  has_enhanced_summary: boolean;
  has_standard_summary: boolean;
  summary_preview: string;
  storage_url: string;
}

export const useLectures = () => {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [subSubjects, setSubSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch from Supabase content_with_summaries view
      const { data: contentData, error } = await supabase
        .from('content_with_summaries')
        .select('*');

      if (error) {
        throw error;
      }

      // Transform data to match expected format
      const transformedData: TopicData[] = (contentData || []).map(item => ({
        content_id: item.content_id || '',
        topic_info: {
          subject: item.subject || '',
          sub_subject: item.sub_subject || '',
          topic: item.topic || '',
          subtopic: item.subtopic || '',
          filename: item.filename || ''
        },
        has_enhanced_summary: !!item.enhanced_summary,
        has_standard_summary: !!item.standard_summary,
        summary_preview: item.enhanced_summary?.substring(0, 150) + '...' || item.standard_summary?.substring(0, 150) + '...' || '',
        storage_url: item.storage_url || ''
      }));

      setTopics(transformedData);
      
      // Extract unique sub_subjects
      const uniqueSubSubjects = [...new Set(transformedData.map(topic => topic.topic_info.sub_subject))];
      setSubSubjects(uniqueSubSubjects);
    } catch (error) {
      console.error('Error loading topic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicsBySubSubject = (subSubjectName: string) => {
    return topics.filter((topic: TopicData) => 
      topic.topic_info.sub_subject.toLowerCase() === subSubjectName.toLowerCase()
    );
  };

  return {
    topics,
    subSubjects,
    loading,
    getTopicsBySubSubject,
    refreshData: loadData
  };
};