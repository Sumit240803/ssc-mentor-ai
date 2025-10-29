import { useState, useEffect } from 'react';

interface LectureFile {
  subject: string;
  topic: string;
  file_name: string;
  url: string;
  type: string;
  size: number;
}

const API_BASE_URL = 'https://sscb-backend-api.onrender.com';

export const useLectures = () => {
  const [lecturesBySubject, setLecturesBySubject] = useState<Record<string, LectureFile[]>>({});
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const subjectsResponse = await fetch(`${API_BASE_URL}/subjects/`);
      const subjectsData = await subjectsResponse.json();
      
      if (subjectsData.status === 'success') {
        setSubjects(subjectsData.data);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecturesBySubject = async (subjectName: string) => {
    // Return cached data if available
    if (lecturesBySubject[subjectName]) {
      return lecturesBySubject[subjectName];
    }

    // Check if already loading
    if (loadingSubjects[subjectName]) {
      return [];
    }

    try {
      setLoadingSubjects(prev => ({ ...prev, [subjectName]: true }));
      
      const response = await fetch(`${API_BASE_URL}/lectures/${encodeURIComponent(subjectName)}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setLecturesBySubject(prev => ({
          ...prev,
          [subjectName]: data.data
        }));
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching lectures by subject:', error);
      return [];
    } finally {
      setLoadingSubjects(prev => ({ ...prev, [subjectName]: false }));
    }
  };

  const getLecturesBySubject = (subjectName: string) => {
    return lecturesBySubject[subjectName] || [];
  };

  const isLoadingSubject = (subjectName: string) => {
    return loadingSubjects[subjectName] || false;
  };

  return {
    lecturesBySubject,
    subjects,
    loading,
    getLecturesBySubject,
    fetchLecturesBySubject,
    isLoadingSubject,
    refreshData: loadSubjects
  };
};