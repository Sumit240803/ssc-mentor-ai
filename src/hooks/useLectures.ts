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
  const [lectures, setLectures] = useState<LectureFile[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch subjects
      const subjectsResponse = await fetch(`${API_BASE_URL}/subjects/`);
      const subjectsData = await subjectsResponse.json();
      
      if (subjectsData.status === 'success') {
        setSubjects(subjectsData.data);
      }

      // Fetch all lectures
      const lecturesResponse = await fetch(`${API_BASE_URL}/lectures/`);
      const lecturesData = await lecturesResponse.json();
      
      if (lecturesData.status === 'success') {
        setLectures(lecturesData.data);
      }
    } catch (error) {
      console.error('Error loading lecture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLecturesBySubject = (subjectName: string) => {
    return lectures.filter((lecture: LectureFile) => 
      lecture.subject.toLowerCase() === subjectName.toLowerCase()
    );
  };

  const fetchLecturesBySubject = async (subjectName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lectures/${encodeURIComponent(subjectName)}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching lectures by subject:', error);
      return [];
    }
  };

  return {
    lectures,
    subjects,
    loading,
    getLecturesBySubject,
    fetchLecturesBySubject,
    refreshData: loadData
  };
};