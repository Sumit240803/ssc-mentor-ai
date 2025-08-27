import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchLectures(),
        fetchSubjects()
      ]);
    } catch (error) {
      console.error('Error loading lecture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLectures = async () => {
    const { data } = await supabase
      .from('lectures')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    setLectures(data || []);
  };

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    
    setSubjects(data || []);
  };

  const getLecturesBySubject = (subjectName: string) => {
    return lectures.filter((lecture: any) => 
      lecture.subject.toLowerCase() === subjectName.toLowerCase()
    );
  };

  return {
    lectures,
    subjects,
    loading,
    getLecturesBySubject,
    refreshData: loadData
  };
};