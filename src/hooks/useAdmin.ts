import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error: any) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const getAdminStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load admin statistics",
        variant: "destructive"
      });
      return null;
    }
  };

  const createLecture = async (lectureData: any) => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .insert([{
          ...lectureData,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lecture created successfully"
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create lecture",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateLecture = async (id: string, lectureData: any) => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .update(lectureData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lecture updated successfully"
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lecture",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteLecture = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lecture deleted successfully"
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete lecture",
        variant: "destructive"
      });
      return { error };
    }
  };

  const getLectures = async () => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load lectures",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const getSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const assignAdminRole = async (email: string) => {
    try {
      // First get the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .single();

      if (userError) throw new Error('User not found');

      // Check if already admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userData.user_id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleData) {
        throw new Error('User is already an admin');
      }

      // Assign admin role
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: userData.user_id,
          role: 'admin'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin role assigned successfully"
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign admin role",
        variant: "destructive"
      });
      return { error };
    }
  };

  return {
    isAdmin,
    loading,
    getAdminStats,
    createLecture,
    updateLecture,
    deleteLecture,
    getLectures,
    getSubjects,
    assignAdminRole
  };
};