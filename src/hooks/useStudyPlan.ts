import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface DayPlan {
  day_number: number;
  math: string;
  general_studies: string;
  reasoning: string;
  static_gk: string;
  computer_current_affairs: string;
}

interface DayProgress {
  math_done: boolean;
  general_studies_done: boolean;
  reasoning_done: boolean;
  static_gk_done: boolean;
  computer_current_affairs_done: boolean;
  completed_at: string | null;
}

interface FullDayPlan extends DayPlan {
  progress: DayProgress;
}

interface StudyPlanData {
  count: number;
  plan: DayPlan[];
}

interface UserFullPlan {
  days: FullDayPlan[];
}

const API_BASE_URL = 'https://sscb-backend-api.onrender.com';

export const useStudyPlan = () => {
  const { user } = useAuth();
  const [fullStudyPlan, setFullStudyPlan] = useState<DayPlan[]>([]);
  const [userFullPlan, setUserFullPlan] = useState<FullDayPlan[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  // Fetch the complete study plan (all 45 days)
  const fetchFullStudyPlan = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/plan/all`);
      if (!response.ok) throw new Error('Failed to fetch study plan');
      
      const data: StudyPlanData = await response.json();
      setFullStudyPlan(data.plan);
      return data.plan;
    } catch (error) {
      console.error('Error fetching full study plan:', error);
      toast.error('Failed to load study plan');
      return [];
    }
  }, []);

  // Fetch user's full plan with progress
  const fetchUserFullPlan = useCallback(async () => {
    if (!user) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/progress/user/${user.id}/full-plan`);
      if (!response.ok) throw new Error('Failed to fetch user progress');
      
      const data: UserFullPlan = await response.json();
      setUserFullPlan(data.days);
      
      // Find the current day (first incomplete day or last day)
      const incompleteDay = data.days.find(day => !day.progress.completed_at);
      setCurrentDay(incompleteDay?.day_number || data.days.length);
      
      return data.days;
    } catch (error) {
      console.error('Error fetching user full plan:', error);
      toast.error('Failed to load your progress');
      return [];
    }
  }, [user]);

  // Check if a day is unlocked
  const checkDayUnlock = useCallback(async (dayNumber: number): Promise<boolean> => {
    if (!user) return false;
    if (dayNumber === 1) return true; // Day 1 is always unlocked

    try {
      const response = await fetch(`${API_BASE_URL}/progress/user/${user.id}/check-unlock/${dayNumber}`);
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.unlocked;
    } catch (error) {
      console.error('Error checking day unlock:', error);
      return false;
    }
  }, [user]);

  // Fetch progress for a specific day
  const fetchDayProgress = useCallback(async (dayNumber: number): Promise<DayProgress | null> => {
    if (!user) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/progress/user/${user.id}/day/${dayNumber}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching day progress:', error);
      return null;
    }
  }, [user]);

  // Update progress for a specific subject
  const updateProgress = useCallback(async (
    dayNumber: number,
    subject: keyof Omit<DayProgress, 'completed_at'>,
    completed: boolean
  ) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return;
    }

    setUpdatingProgress(true);
    try {
      // Get current progress for this day
      const currentProgress = userFullPlan.find(day => day.day_number === dayNumber)?.progress || {
        math_done: false,
        general_studies_done: false,
        reasoning_done: false,
        static_gk_done: false,
        computer_current_affairs_done: false,
        completed_at: null
      };

      // Update the specific subject
      const updatedProgress = {
        ...currentProgress,
        [subject]: completed
      };

      // Prepare payload
      const payload = {
        user_id: user.id,
        day_number: dayNumber,
        math_done: updatedProgress.math_done,
        general_studies_done: updatedProgress.general_studies_done,
        reasoning_done: updatedProgress.reasoning_done,
        static_gk_done: updatedProgress.static_gk_done,
        computer_current_affairs_done: updatedProgress.computer_current_affairs_done
      };

      const response = await fetch(`${API_BASE_URL}/progress/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update progress');

      const result = await response.json();
      
      // Refresh user's full plan to get updated data
      await fetchUserFullPlan();
      
      // Check if day is completed
      if (result.completed_at) {
        toast.success(`🎉 Day ${dayNumber} completed! Great job!`);
      } else {
        toast.success('Progress updated');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    } finally {
      setUpdatingProgress(false);
    }
  }, [user, userFullPlan, fetchUserFullPlan]);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchFullStudyPlan();
      if (user) {
        await fetchUserFullPlan();
      }
      setLoading(false);
    };

    loadData();
  }, [user, fetchFullStudyPlan, fetchUserFullPlan]);

  // Get statistics
  const getStats = useCallback(() => {
    if (!userFullPlan.length) return {
      totalDays: 45,
      completedDays: 0,
      currentDay: 1,
      totalSubjects: 0,
      completedSubjects: 0,
      progressPercentage: 0
    };

    const completedDays = userFullPlan.filter(day => day.progress.completed_at).length;
    const totalSubjects = userFullPlan.length * 5; // 5 subjects per day
    const completedSubjects = userFullPlan.reduce((acc, day) => {
      return acc + 
        (day.progress.math_done ? 1 : 0) +
        (day.progress.general_studies_done ? 1 : 0) +
        (day.progress.reasoning_done ? 1 : 0) +
        (day.progress.static_gk_done ? 1 : 0) +
        (day.progress.computer_current_affairs_done ? 1 : 0);
    }, 0);

    return {
      totalDays: userFullPlan.length,
      completedDays,
      currentDay,
      totalSubjects,
      completedSubjects,
      progressPercentage: Math.round((completedSubjects / totalSubjects) * 100)
    };
  }, [userFullPlan, currentDay]);

  return {
    fullStudyPlan,
    userFullPlan,
    currentDay,
    loading,
    updatingProgress,
    checkDayUnlock,
    fetchDayProgress,
    updateProgress,
    refreshUserPlan: fetchUserFullPlan,
    stats: getStats()
  };
};
