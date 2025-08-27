import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [todayTasks, setTodayTasks] = useState([]);
  const [recentLectures, setRecentLectures] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTodayTasks(),
        fetchRecentLectures(),
        fetchDailyQuote(),
        fetchUserStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayTasks = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user?.id)
      .eq('scheduled_date', today)
      .order('scheduled_time', { ascending: true })
      .limit(3);
    
    setTodayTasks(data || []);
  };

  const fetchRecentLectures = async () => {
    const { data } = await supabase
      .from('lectures')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    setRecentLectures(data || []);
  };

  const fetchDailyQuote = async () => {
    const { data } = await supabase
      .from('motivational_content')
      .select('*')
      .eq('type', 'quote')
      .eq('is_daily', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    setDailyQuote(data);
  };

  const fetchUserStats = async () => {
    let { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    // Create default stats if none exist
    if (!stats) {
      const { data: newStats } = await supabase
        .from('user_stats')
        .insert([{
          user_id: user?.id,
          study_hours_total: 0,
          lectures_completed: 0,
          current_streak: 0,
          tasks_completed_today: 0,
          motivation_score: 80
        }])
        .select()
        .single();
      
      stats = newStats;
    }
    
    setUserStats(stats);
  };

  const toggleTask = async (taskId: string) => {
    const task = todayTasks.find((t: any) => t.id === taskId);
    if (!task) return;

    const { data } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', taskId)
      .select()
      .single();

    if (data) {
      setTodayTasks(todayTasks.map((t: any) => 
        t.id === taskId ? data : t
      ));

      // Update user stats if task was completed
      if (data.is_completed && userStats) {
        await supabase
          .from('user_stats')
          .update({ 
            tasks_completed_today: userStats.tasks_completed_today + 1 
          })
          .eq('user_id', user?.id);
      }
    }
  };

  return {
    todayTasks,
    recentLectures,
    dailyQuote,
    userStats,
    loading,
    toggleTask,
    refreshData: loadDashboardData
  };
};