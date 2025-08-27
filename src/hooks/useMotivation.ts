import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useMotivation = () => {
  const { user } = useAuth();
  const [dailyQuote, setDailyQuote] = useState(null);
  const [motivationalContent, setMotivationalContent] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDailyQuote(),
        fetchMotivationalContent(),
        user && fetchUserStats()
      ]);
    } catch (error) {
      console.error('Error loading motivation data:', error);
    } finally {
      setLoading(false);
    }
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

  const fetchMotivationalContent = async () => {
    const { data } = await supabase
      .from('motivational_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);
    
    setMotivationalContent(data || []);
  };

  const fetchUserStats = async () => {
    if (!user) return;

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

  return {
    dailyQuote,
    motivationalContent,
    userStats,
    loading,
    refreshData: loadData
  };
};