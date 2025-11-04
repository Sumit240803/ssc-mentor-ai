import { useState, useEffect } from 'react';

interface FileItem {
  file_name: string;
  url: string;
  type: string;
  size: number;
}

interface LectureTopic {
  subject: string;
  section: string;
  topic: string;
  files: FileItem[];
}

const API_BASE_URL = 'https://sscb-backend-api.onrender.com';

export const useLectures = () => {
  const [lecturesBySubject, setLecturesBySubject] = useState<Record<string, LectureTopic[]>>({});
  const [fetchedSubjects, setFetchedSubjects] = useState<Set<string>>(new Set());
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
    // Check if already fetched (memoized)
    if (fetchedSubjects.has(subjectName)) {
      return lecturesBySubject[subjectName] || [];
    }

    // Check if already loading
    if (loadingSubjects[subjectName]) {
      return [];
    }

    try {
      setLoadingSubjects(prev => ({ ...prev, [subjectName]: true }));
      
      // Fetch all lectures at once with a limit of 100
      const response = await fetch(`${API_BASE_URL}/lectures/${encodeURIComponent(subjectName)}?limit=100`);
      const data = await response.json();
      
      if (data.status === 'success') {
        // Filter out empty placeholder files
        const filteredData = data.data
          .map((topic: LectureTopic) => ({
            ...topic,
            files: topic.files.filter((file: FileItem) => !file.file_name.includes('.emptyFolderPlaceholder'))
          }))
          .filter((topic: LectureTopic) => topic.files.length > 0);

        setLecturesBySubject(prev => ({
          ...prev,
          [subjectName]: filteredData
        }));

        // Mark subject as fetched
        setFetchedSubjects(prev => new Set([...prev, subjectName]));

        return filteredData;
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