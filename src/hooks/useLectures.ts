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

interface PaginationInfo {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  count: number;
}

const API_BASE_URL = 'https://sscb-backend-api.onrender.com';

export const useLectures = () => {
  const [lecturesBySubject, setLecturesBySubject] = useState<Record<string, LectureTopic[]>>({});
  const [paginationBySubject, setPaginationBySubject] = useState<Record<string, PaginationInfo>>({});
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

  const fetchLecturesBySubject = async (subjectName: string, page: number = 1) => {
    // Check if already loading
    if (loadingSubjects[subjectName]) {
      return [];
    }

    try {
      setLoadingSubjects(prev => ({ ...prev, [subjectName]: true }));
      
      const response = await fetch(`${API_BASE_URL}/lectures/${encodeURIComponent(subjectName)}?page=${page}&limit=10`);
      const data = await response.json();
      
      if (data.status === 'success') {
        // Filter out empty placeholder files
        const filteredData = data.data
          .map((topic: LectureTopic) => ({
            ...topic,
            files: topic.files.filter((file: FileItem) => !file.file_name.includes('.emptyFolderPlaceholder'))
          }))
          .filter((topic: LectureTopic) => topic.files.length > 0);

        if (page === 1) {
          setLecturesBySubject(prev => ({
            ...prev,
            [subjectName]: filteredData
          }));
        } else {
          setLecturesBySubject(prev => ({
            ...prev,
            [subjectName]: [...(prev[subjectName] || []), ...filteredData]
          }));
        }

        setPaginationBySubject(prev => ({
          ...prev,
          [subjectName]: {
            page: data.page,
            limit: data.limit,
            total_items: data.total_items,
            total_pages: data.total_pages,
            count: data.count
          }
        }));

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

  const getPaginationInfo = (subjectName: string) => {
    return paginationBySubject[subjectName];
  };

  const isLoadingSubject = (subjectName: string) => {
    return loadingSubjects[subjectName] || false;
  };

  return {
    lecturesBySubject,
    subjects,
    loading,
    getLecturesBySubject,
    getPaginationInfo,
    fetchLecturesBySubject,
    isLoadingSubject,
    refreshData: loadSubjects
  };
};