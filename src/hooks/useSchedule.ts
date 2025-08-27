import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSchedule = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTodayTasks(),
        fetchUserStats()
      ]);
    } catch (error) {
      console.error('Error loading schedule data:', error);
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
      .order('scheduled_time', { ascending: true });
    
    setTasks(data || []);
  };

  const fetchUserStats = async () => {
    let { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

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
    const task = tasks.find((t: any) => t.id === taskId);
    if (!task) return;

    const { data } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', taskId)
      .select()
      .single();

    if (data) {
      setTasks(tasks.map((t: any) => 
        t.id === taskId ? data : t
      ));

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
    tasks,
    userStats,
    loading,
    toggleTask,
    refreshData: loadData
  };
};