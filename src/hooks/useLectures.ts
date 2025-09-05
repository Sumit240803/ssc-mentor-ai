import { useState, useEffect } from 'react';

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
      const response = await fetch('https://study-ai-rohit.vercel.app/topics');
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data: TopicData[] = await response.json();
      setTopics(data);
      
      // Extract unique sub_subjects
      const uniqueSubSubjects = [...new Set(data.map(topic => topic.topic_info.sub_subject))];
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