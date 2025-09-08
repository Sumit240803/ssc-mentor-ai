import { useState, useEffect } from 'react';

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

export interface Chapter {
  chapter: string;
  questions: Question[];
}

export interface Section {
  section: string;
  chapters: Chapter[];
}

export interface MockTestData {
  mockTest: Section[];
}

export interface TestQuestion extends Question {
  id: number;
  section: string;
  chapter: string;
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

const EXAM_PATTERN = {
  'General Science': 50,
  'Reasoning': 25,
  'Mathematics': 15,
  'Computer': 10,
};

const EXAM_DURATION = 90 * 60; // 90 minutes in seconds

export const useMockTest = () => {
  const [mockTestData, setMockTestData] = useState<MockTestData | null>(null);
  const [testState, setTestState] = useState<TestState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    timeRemaining: EXAM_DURATION,
    isActive: false,
    isCompleted: false,
    startTime: null,
    endTime: null,
  });

  // Load mock test data
  useEffect(() => {
    const loadMockTestData = async () => {
      try {
        const response = await fetch('/mockTestData.json');
        const data: MockTestData = await response.json();
        setMockTestData(data);
      } catch (error) {
        console.error('Error loading mock test data:', error);
      }
    };

    loadMockTestData();
  }, []);

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

  const generateRandomQuestions = (): TestQuestion[] => {
    if (!mockTestData) return [];

    const selectedQuestions: TestQuestion[] = [];
    let questionId = 1;

    Object.entries(EXAM_PATTERN).forEach(([sectionName, count]) => {
      const section = mockTestData.mockTest.find(s => s.section === sectionName);
      if (!section) return;

      // Collect all questions from all chapters in this section
      const allQuestions: TestQuestion[] = [];
      section.chapters.forEach(chapter => {
        chapter.questions.forEach(question => {
          allQuestions.push({
            ...question,
            id: questionId++,
            section: sectionName,
            chapter: chapter.chapter,
          });
        });
      });

      // Randomly select the required number of questions
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));
      selectedQuestions.push(...selected);
    });

    return selectedQuestions.sort(() => Math.random() - 0.5); // Final shuffle
  };

  const startTest = () => {
    const questions = generateRandomQuestions();
    setTestState({
      questions,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: EXAM_DURATION,
      isActive: true,
      isCompleted: false,
      startTime: new Date(),
      endTime: null,
    });
  };

  const submitTest = () => {
    setTestState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      endTime: new Date(),
    }));
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

  const getResults = () => {
    const totalQuestions = testState.questions.length;
    const answeredQuestions = Object.keys(testState.userAnswers).length;
    const correctAnswers = Object.values(testState.userAnswers).filter(answer => answer.isCorrect).length;
    const incorrectAnswers = Object.values(testState.userAnswers).filter(answer => !answer.isCorrect).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    
    const timeTaken = testState.startTime && testState.endTime 
      ? Math.floor((testState.endTime.getTime() - testState.startTime.getTime()) / 1000)
      : EXAM_DURATION - testState.timeRemaining;

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
      timeRemaining: EXAM_DURATION,
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