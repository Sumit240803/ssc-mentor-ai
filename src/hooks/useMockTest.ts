import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Question {
  question: string;
  options: string[];
  answer: string;
  pyq: boolean;
  pyqDetails: {
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
  startTime: Date | null;
  endTime: Date | null;
}

export const useMockTest = (testFileName?: string) => {
  const { user } = useAuth();
  const [mockTestData, setMockTestData] = useState<MockTestData | null>(null);
  const [testState, setTestState] = useState<TestState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    timeRemaining: 90 * 60, // Default 90 minutes
    isActive: false,
    isCompleted: false,
    startTime: null,
    endTime: null,
  });

  // Load mock test data
  useEffect(() => {
    const loadMockTestData = async () => {
      if (!testFileName) return;
      
      try {
        const response = await fetch(`/${testFileName}.json`);
        const data: MockTestData = await response.json();
        setMockTestData(data);
        
        // Update time remaining based on test duration
        setTestState(prev => ({
          ...prev,
          timeRemaining: data.duration * 60,
        }));
      } catch (error) {
        console.error('Error loading mock test data:', error);
      }
    };

    loadMockTestData();
  }, [testFileName]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (testState.isActive && testState.timeRemaining > 0 && !testState.isCompleted) {
      interval = setInterval(() => {
        setTestState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          if (newTimeRemaining <= 0) {
            // Auto-submit when time is up
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
      if (interval) clearInterval(interval);
    };
  }, [testState.isActive, testState.timeRemaining, testState.isCompleted]);

  const generateQuestions = (): TestQuestion[] => {
    if (!mockTestData) return [];

    const allQuestions: TestQuestion[] = [];
    let questionId = 1;

    mockTestData.mockTest.forEach((section) => {
      section.questions.forEach((question) => {
        allQuestions.push({
          ...question,
          id: questionId++,
          section: section.section,
        });
      });
    });

    return allQuestions;
  };

  const startTest = () => {
    const questions = generateQuestions();
    setTestState({
      questions,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: mockTestData ? mockTestData.duration * 60 : 90 * 60,
      isActive: true,
      isCompleted: false,
      startTime: new Date(),
      endTime: null,
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

    // Save results to database
    await saveResultsToDatabase(endTime);
  };

  const answerQuestion = (questionId: number, selectedOption: string) => {
    const question = testState.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = question.answer === selectedOption;
    
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
    setTestState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, Math.min(index, prev.questions.length - 1)),
    }));
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
    const sectionScores: Record<string, { correct: number; total: number; percentage: number }> = {};
    
    testState.questions.forEach((question) => {
      const sectionName = question.section;
      if (!sectionScores[sectionName]) {
        sectionScores[sectionName] = { correct: 0, total: 0, percentage: 0 };
      }
      
      sectionScores[sectionName].total++;
      
      const userAnswer = testState.userAnswers[question.id];
      if (userAnswer && userAnswer.isCorrect) {
        sectionScores[sectionName].correct++;
      }
    });
    
    // Calculate percentages
    Object.keys(sectionScores).forEach(section => {
      const score = sectionScores[section];
      score.percentage = Math.round((score.correct / score.total) * 100);
    });
    
    return sectionScores;
  };

  const saveResultsToDatabase = async (endTime: Date) => {
    if (!user || !mockTestData) return;

    try {
      const results = getResults();
      const sectionWiseScores = calculateSectionWiseScores();
      
      const { error } = await supabase
        .from('mock_test_results')
        .insert({
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
          section_wise_scores: sectionWiseScores,
        });

      if (error) {
        console.error('Error saving test results:', error);
      }
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  const getResults = () => {
    const totalQuestions = testState.questions.length;
    const answeredQuestions = Object.keys(testState.userAnswers).length;
    const correctAnswers = Object.values(testState.userAnswers).filter(answer => answer.isCorrect).length;
    const incorrectAnswers = Object.values(testState.userAnswers).filter(answer => !answer.isCorrect).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    
    const timeTaken = testState.startTime && testState.endTime 
      ? Math.floor((testState.endTime.getTime() - testState.startTime.getTime()) / 1000)
      : (mockTestData ? mockTestData.duration * 60 : 90 * 60) - testState.timeRemaining;

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      score: correctAnswers,
      percentage: Math.round((correctAnswers / totalQuestions) * 100),
      timeTaken,
    };
  };

  const resetTest = () => {
    setTestState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: mockTestData ? mockTestData.duration * 60 : 90 * 60,
      isActive: false,
      isCompleted: false,
      startTime: null,
      endTime: null,
    });
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

  return {
    mockTestData,
    testState,
    startTest,
    submitTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    getResults,
    resetTest,
    formatTime,
    isDataLoaded: !!mockTestData,
  };
};
