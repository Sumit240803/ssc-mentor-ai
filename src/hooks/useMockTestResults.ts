import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'https://sscb-backend-api.onrender.com';

export interface MockTestResult {
  id: string;
  user_id: string;
  test_name: string;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered_questions: number;
  score: number;
  percentage: number;
  time_taken_seconds: number;
  section_wise_scores?: Record<string, {
    total: number;
    correct: number;
    percentage: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface CreateMockTestResultPayload {
  user_id: string;
  test_name: string;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered_questions: number;
  score: number;
  percentage: number;
  time_taken_seconds: number;
  section_wise_scores?: Record<string, {
    total: number;
    correct: number;
    percentage: number;
  }>;
}

export const useMockTestResults = () => {
  const { user } = useAuth();
  const [userResults, setUserResults] = useState<MockTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all results for the current user
  const fetchUserResults = useCallback(async () => {
    if (!user?.id) {
      console.log('No user logged in, skipping fetch');
      setUserResults([]); // Clear results if no user
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/mock-tests/user/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const data = await response.json();
      setUserResults(data.results || []);
      console.log(`Fetched ${data.count} mock test results for user`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch results';
      setError(errorMessage);
      console.error('Error fetching user results:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Create a new mock test result
  const createMockTestResult = async (payload: CreateMockTestResultPayload): Promise<MockTestResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/mock-tests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save result: ${response.status}`);
      }

      const data = await response.json();
      const newResult = data.data[0];
      
      console.log('Mock test result saved:', newResult);
      
      // Refresh user results after creating a new one
      await fetchUserResults();
      
      return newResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save result';
      setError(errorMessage);
      console.error('Error creating mock test result:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single result by ID
  const fetchResultById = async (resultId: string): Promise<MockTestResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/mock-tests/${resultId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch result: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch result';
      setError(errorMessage);
      console.error('Error fetching result by ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has attempted a specific test
  const hasAttemptedTest = useCallback((testName: string): boolean => {
    return userResults.some(result => result.test_name === testName);
  }, [userResults]);

  // Get last attempt for a specific test
  const getLastAttempt = useCallback((testName: string): MockTestResult | undefined => {
    const attempts = userResults.filter(result => result.test_name === testName);
    return attempts.length > 0 ? attempts[0] : undefined; // Results are sorted by created_at desc
  }, [userResults]);

  // Get all attempts for a specific test
  const getTestAttempts = useCallback((testName: string): MockTestResult[] => {
    return userResults.filter(result => result.test_name === testName);
  }, [userResults]);

  // Load user results on mount
  useEffect(() => {
    if (user?.id) {
      fetchUserResults();
    }
  }, [user?.id, fetchUserResults]);

  return {
    userResults,
    loading,
    error,
    fetchUserResults,
    createMockTestResult,
    fetchResultById,
    hasAttemptedTest,
    getLastAttempt,
    getTestAttempts,
  };
};
