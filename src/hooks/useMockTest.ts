import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

export interface Question {
  'question-image'?: string;
  'question-hindi': string;
  'question-english': string;
  'options-hindi': string[];
  'options-english': string[];
  'answer-hindi': string;
  'answer-english': string;
  'solution-hindi': string;
  'solution-english': string;
  pyq?: boolean;
  pyqDetails?: {
    year: number | null;
    paper: string;
  };
}

export interface Section {
  section: string;
  questions: Question[];
}

export interface MockTestData {
  testName: string;
  duration: number;
  mockTest: Section[];
}

export interface TestQuestion extends Question {
  id: number;
  section: string;
}

export type Language = 'hindi' | 'english';

export interface UserAnswer {
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
}

export interface TestState {
  questions: TestQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<number, UserAnswer>;
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  isReviewMode: boolean;
  isPaused: boolean;
  startTime: Date | null;
  endTime: Date | null;
  language: Language;
  totalPausedTime: number;
  lastPauseTime: Date | null;
}

export interface MockTestAnalysis {
  analysis: string;
}

export type PreviousTestResult = Database['public']['Tables']['mock_test_results']['Row'];

export const useMockTest = (testFileName?: string) => {
  const { user } = useAuth();
  const [mockTestData, setMockTestData] = useState<MockTestData | null>(null);
  const [previousResults, setPreviousResults] = useState<PreviousTestResult[]>([]);
  const [loadingPreviousResults, setLoadingPreviousResults] = useState(false);
  const [testState, setTestState] = useState<TestState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    timeRemaining: 90 * 60, // Default 90 minutes
    isActive: false,
    isCompleted: false,
    isReviewMode: false,
    isPaused: false,
    startTime: null,
    endTime: null,
    language: 'hindi',
    totalPausedTime: 0,
    lastPauseTime: null,
  });

  // Get localStorage key for the current test
  const getStorageKey = () => {
    if (!testFileName || !user?.id) return null;
    return `mock_test_progress_${user.id}_${testFileName}`;
  };

  // Save test state to localStorage
  const saveToLocalStorage = (state: TestState) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      const dataToSave = {
        ...state,
        startTime: state.startTime?.toISOString(),
        endTime: state.endTime?.toISOString(),
        lastPauseTime: state.lastPauseTime?.toISOString(),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log('Test progress saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load test state from localStorage
  const loadFromLocalStorage = (): TestState | null => {
    const storageKey = getStorageKey();
    if (!storageKey) return null;

    try {
      const savedData = localStorage.getItem(storageKey);
      if (!savedData) return null;

      const parsed = JSON.parse(savedData);
      
      // Convert date strings back to Date objects
      return {
        ...parsed,
        startTime: parsed.startTime ? new Date(parsed.startTime) : null,
        endTime: parsed.endTime ? new Date(parsed.endTime) : null,
        lastPauseTime: parsed.lastPauseTime ? new Date(parsed.lastPauseTime) : null,
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  // Clear localStorage for this test
  const clearLocalStorage = () => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      localStorage.removeItem(storageKey);
      console.log('Test progress cleared from localStorage');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  // Load mock test data and previous results
  useEffect(() => {
    const loadMockTestData = async () => {
      if (!testFileName) return;
      
      try {
        const response = await fetch(`/${testFileName}.json`);
        console.log('Fetching mock test data from:', `/${testFileName}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load test: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Mock test data loaded:', data);
        
        // Set default duration if missing
        const duration = data.duration || 90;
        const testData: MockTestData = {
          testName: testFileName
  .replace(/^Complete_/, '')   // remove starting "Complete_"
  .replace(/\.json$/, '')      // remove ending ".json"
  .replace(/_/g, ' ').replace(/-/g, ' ').toUpperCase(),        // replace underscores with spaces// Remove .json
          duration,
          mockTest: data.mockTest || [],
        };
        
        setMockTestData(testData);
        
        // Update time remaining based on test duration
        setTestState(prev => ({
          ...prev,
          timeRemaining: duration * 60,
        }));

        // Try to load saved progress from localStorage
        const savedState = loadFromLocalStorage();
        if (savedState && savedState.isActive && !savedState.isCompleted) {
          console.log('Restoring saved test progress from localStorage');
          setTestState(savedState);
        }

        // Load previous results if user is logged in
        if (user && testFileName) {
          await fetchPreviousResults(testFileName);
        }
      } catch (error) {
        console.error('Error loading mock test data:', error);
      }
    };

    loadMockTestData();
  }, [testFileName, user]);

  // Auto-save test state to localStorage whenever it changes
  useEffect(() => {
    if (testState.isActive && !testState.isCompleted) {
      saveToLocalStorage(testState);
    }
  }, [testState, user, testFileName]);

  // Note: fetchPreviousResults is deprecated - use useMockTestResults hook instead
  const fetchPreviousResults = async (fileName: string) => {
    if (!user) return;
    
    setLoadingPreviousResults(true);
    try {
      // This function is deprecated and no longer used
      // Use useMockTestResults hook to fetch results via API
      console.log('fetchPreviousResults is deprecated, use useMockTestResults hook instead');
      setPreviousResults([]);
    } catch (error) {
      console.error('Error fetching previous results:', error);
    } finally {
      setLoadingPreviousResults(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (testState.isActive && !testState.isCompleted && !testState.isPaused) {
      console.log('Timer started with', testState.timeRemaining, 'seconds');
      interval = setInterval(() => {
        setTestState(prev => {
          if (!prev.isActive || prev.isCompleted || prev.isPaused) {
            return prev;
          }
          
          const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
          console.log('Time remaining:', newTimeRemaining);
          
          if (newTimeRemaining <= 0) {
            // Auto-submit when time is up
            console.log('Time up! Auto-submitting test');
            return {
              ...prev,
              timeRemaining: 0,
              isActive: false,
              isCompleted: true,
              endTime: new Date(),
            };
          }
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [testState.isActive, testState.isCompleted, testState.isPaused]);

  const generateQuestions = (): TestQuestion[] => {
    if (!mockTestData) return [];

    const allQuestions: TestQuestion[] = [];
    let questionId = 1;

    mockTestData.mockTest.forEach((section) => {
      section.questions.forEach((question: any) => {
        allQuestions.push({
          'question-image': question['question-image'],
          'question-hindi': question['question-hindi'] || '',
          'question-english': question['question-english'] || '',
          'options-hindi': question['options-hindi'] || [],
          'options-english': question['options-english'] || [],
          'answer-hindi': question['answer-hindi'] || '',
          'answer-english': question['answer-english'] || '',
          'solution-hindi': question['solution-hindi'] || '',
          'solution-english': question['solution-english'] || '',
          pyq: question.pyq || false,
          pyqDetails: question.pyqDetails || { year: null, paper: '' },
          id: questionId++,
          section: section.section,
        });
      });
    });

    return allQuestions;
  };

  const startTest = (language: Language = 'hindi') => {
    const questions = generateQuestions();
    setTestState({
      questions,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: mockTestData ? mockTestData.duration * 60 : 90 * 60,
      isActive: true,
      isCompleted: false,
      isReviewMode: false,
      isPaused: false,
      startTime: new Date(),
      endTime: null,
      language,
      totalPausedTime: 0,
      lastPauseTime: null,
    });
  };

  const pauseTest = () => {
    setTestState(prev => ({
      ...prev,
      isPaused: true,
      lastPauseTime: new Date(),
    }));
  };

  const resumeTest = () => {
    setTestState(prev => {
      const now = new Date();
      const pauseDuration = prev.lastPauseTime 
        ? Math.floor((now.getTime() - prev.lastPauseTime.getTime()) / 1000)
        : 0;
      
      return {
        ...prev,
        isPaused: false,
        totalPausedTime: prev.totalPausedTime + pauseDuration,
        lastPauseTime: null,
      };
    });
  };

  const submitTest = async () => {
    const endTime = new Date();
    setTestState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      endTime,
    }));

    // Clear localStorage when test is submitted
    clearLocalStorage();

    // Save results to database
    await saveResultsToDatabase(endTime);
  };

  const answerQuestion = (questionId: number, selectedOption: string) => {
    const question = testState.questions.find(q => q.id === questionId);
    if (!question) return;

    const correctAnswer = testState.language === 'hindi' 
      ? question['answer-hindi'] 
      : question['answer-english'];
    const isCorrect = correctAnswer === selectedOption;
    
    setTestState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: {
          questionId,
          selectedOption,
          isCorrect,
        },
      },
    }));
  };

  const goToQuestion = (index: number) => {
    setTestState(prev => {
      const validIndex = Math.max(0, Math.min(index, prev.questions.length - 1));
      console.log('Navigating to question:', validIndex, 'Total questions:', prev.questions.length);
      return {
        ...prev,
        currentQuestionIndex: validIndex,
      };
    });
  };

  const nextQuestion = () => {
    setTestState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1),
    }));
  };

  const previousQuestion = () => {
    setTestState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  };

  const calculateSectionWiseScores = () => {
    const sectionScores: Record<string, { correct: number; incorrect: number; total: number; score: number; percentage: number }> = {};
    
    testState.questions.forEach((question) => {
      const sectionName = question.section;
      if (!sectionScores[sectionName]) {
        sectionScores[sectionName] = { correct: 0, incorrect: 0, total: 0, score: 0, percentage: 0 };
      }
      
      sectionScores[sectionName].total++;
      
      const userAnswer = testState.userAnswers[question.id];
      if (userAnswer) {
        if (userAnswer.isCorrect) {
          sectionScores[sectionName].correct++;
        } else {
          sectionScores[sectionName].incorrect++;
        }
      }
    });
    
    // Calculate scores with negative marking (+1 for correct, -0.25 for incorrect)
    Object.keys(sectionScores).forEach(section => {
      const sectionData = sectionScores[section];
      sectionData.score = sectionData.correct * 1 + sectionData.incorrect * (-0.25);
      sectionData.percentage = Math.round((sectionData.score / sectionData.total) * 100);
    });
    
    return sectionScores;
  };

  const saveResultsToDatabase = async (endTime: Date) => {
    if (!user || !mockTestData) return;

    try {
      const results = getResults();
      const sectionWiseScores = calculateSectionWiseScores();
      
      // Prepare section-wise scores in the API format
      const formattedSectionScores: Record<string, { total: number; correct: number; percentage: number }> = {};
      Object.entries(sectionWiseScores).forEach(([section, data]) => {
        formattedSectionScores[section] = {
          total: data.total,
          correct: data.correct,
          percentage: data.percentage,
        };
      });

      // Save test results to API
      const response = await fetch('https://sscb-backend-api.onrender.com/mock-tests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          test_name: mockTestData.testName,
          total_questions: results.totalQuestions,
          answered_questions: results.answeredQuestions,
          correct_answers: results.correctAnswers,
          incorrect_answers: results.incorrectAnswers,
          unanswered_questions: results.unansweredQuestions,
          score: results.score,
          percentage: results.percentage,
          time_taken_seconds: results.timeTaken,
          section_wise_scores: formattedSectionScores,
        }),
      });

      if (!response.ok) {
        console.error('Error saving test results:', response.status);
      } else {
        const data = await response.json();
        console.log('Test results saved successfully:', data);
      }

      // Update motivation score based on test performance
      await updateMotivationScore(results.percentage);
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  const updateMotivationScore = async (percentage: number) => {
    if (!user) return;

    try {
      // Get current motivation score
      const { data: currentStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('motivation_score')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching motivation score:', fetchError);
        return;
      }

      const currentScore = currentStats?.motivation_score || 80;
      let scoreChange = 0;

      // Calculate score change based on performance
      if (percentage >= 80) {
        scoreChange = 10; // Excellent performance
      } else if (percentage >= 60) {
        scoreChange = 5; // Good performance
      } else if (percentage >= 40) {
        scoreChange = 0; // Average performance
      } else {
        scoreChange = -5; // Below average performance
      }

      // Calculate new score (capped between 0 and 100)
      const newScore = Math.max(0, Math.min(100, currentScore + scoreChange));

      // Update motivation score
      const { error: updateError } = await supabase
        .from('user_stats')
        .update({ motivation_score: newScore })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating motivation score:', updateError);
      }
    } catch (error) {
      console.error('Error updating motivation score:', error);
    }
  };

  const getResults = () => {
    const totalQuestions = testState.questions.length;
    const answeredQuestions = Object.keys(testState.userAnswers).length;
    const correctAnswers = Object.values(testState.userAnswers).filter(answer => answer.isCorrect).length;
    const incorrectAnswers = Object.values(testState.userAnswers).filter(answer => !answer.isCorrect).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    
    // Calculate score with negative marking: +1 for correct, -0.25 for incorrect
    const score = correctAnswers * 1 + incorrectAnswers * (-0.25);
    
    const timeTaken = testState.startTime && testState.endTime 
      ? Math.floor((testState.endTime.getTime() - testState.startTime.getTime()) / 1000)
      : (mockTestData ? mockTestData.duration * 60 : 90 * 60) - testState.timeRemaining;

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      score,
      percentage: Math.round((score / totalQuestions) * 100),
      timeTaken,
      totalPausedTime: testState.totalPausedTime,
      totalTimeIncludingPauses: timeTaken + testState.totalPausedTime,
    };
  };

  const switchLanguage = (language: Language) => {
    setTestState(prev => ({
      ...prev,
      language,
    }));
  };

  const resetTest = () => {
    // Clear localStorage when resetting test
    clearLocalStorage();
    
    setTestState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: mockTestData ? mockTestData.duration * 60 : 90 * 60,
      isActive: false,
      isCompleted: false,
      isReviewMode: false,
      isPaused: false,
      startTime: null,
      endTime: null,
      language: 'hindi',
      totalPausedTime: 0,
      lastPauseTime: null,
    });
  };

  const enterReviewMode = () => {
    setTestState(prev => ({
      ...prev,
      isReviewMode: true,
      currentQuestionIndex: 0,
    }));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getMotivation = async (motivationScore: number): Promise<{ message: string } | null> => {
    try {
      const response = await fetch('https://sscb-backend-api.onrender.com/chat/motivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motivation_score: motivationScore,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch motivation');
      }

      const data: { message: string } = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching motivation:', error);
      return null;
    }
  };

  const getAnalysis = async (): Promise<MockTestAnalysis | null> => {
    try {
      const results = getResults();
      const sectionWiseScores = calculateSectionWiseScores();
      
      // Transform section scores to match API format
      const subjectWiseScore: Record<string, { correct: number; total: number; percentage: number }> = {};
      Object.entries(sectionWiseScores).forEach(([section, scores]) => {
        subjectWiseScore[section] = scores;
      });
      
      const response = await fetch('https://sscb-backend-api.onrender.com/mocktest/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_questions: results.totalQuestions,
          correct_answers: results.correctAnswers,
          wrong_answers: results.incorrectAnswers,
          skipped_questions: results.unansweredQuestions,
          subject_wise_score: subjectWiseScore,
          time_taken_minutes: Math.round(results.timeTaken / 60),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data: MockTestAnalysis = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching test analysis:', error);
      return null;
    }
  };

  return {
    mockTestData,
    testState,
    startTest,
    submitTest,
    pauseTest,
    resumeTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    getResults,
    calculateSectionWiseScores,
    resetTest,
    enterReviewMode,
    switchLanguage,
    formatTime,
    getMotivation,
    getAnalysis,
    isDataLoaded: !!mockTestData,
    previousResults,
    loadingPreviousResults,
  };
};
