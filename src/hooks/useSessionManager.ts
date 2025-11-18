import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://sscb-backend-api.onrender.com';

interface ActiveSession {
  session_id: string;
  user_agent: string;
  created_at: string;
  last_activity: string;
}

export const useSessionManager = () => {
  const [isValidating, setIsValidating] = useState(false);

  // Register new session (called on login)
  const registerSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const response = await fetch(`${API_BASE_URL}/sessions/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: session.access_token,
          user_agent: navigator.userAgent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Session registration error:', error);
      throw error;
    }
  }, []);

  // Get active sessions
  const getActiveSessions = useCallback(async (): Promise<ActiveSession[]> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        throw new Error('No active session');
      }

      const response = await fetch(`${API_BASE_URL}/sessions/active?user_id=${session.user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch active sessions');
      }

      const data = await response.json();
      return data.sessions || [];
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      return [];
    }
  }, []);

  // Logout from current session
  const logoutSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const response = await fetch(`${API_BASE_URL}/sessions/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: session.access_token
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to logout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Logout session error:', error);
      throw error;
    }
  }, []);

  // Validate current session (check if multiple sessions exist and logout old ones)
  const validateSession = useCallback(async () => {
    try {
      setIsValidating(true);
      const sessions = await getActiveSessions();
      
      if (sessions.length > 1) {
        // Multiple sessions detected - user will be logged out from old session automatically by backend
        return { valid: true, multiple_sessions: true, sessions };
      }

      return { valid: true, multiple_sessions: false, sessions };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, reason: 'Validation failed' };
    } finally {
      setIsValidating(false);
    }
  }, [getActiveSessions]);

  return {
    isValidating,
    registerSession,
    getActiveSessions,
    logoutSession,
    validateSession
  };
};