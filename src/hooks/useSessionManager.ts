import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SessionData {
  id: string;
  session_id: string;
  device_info: any;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSessionManager = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Generate a unique session ID for this browser session
  const generateSessionId = useCallback(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(sessionId);
    localStorage.setItem('app_session_id', sessionId);
    return sessionId;
  }, []);

  // Get or create session ID
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('app_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
    } else {
      setCurrentSessionId(sessionId);
    }
    return sessionId;
  }, [generateSessionId]);

  // Register new session (called on login)
  const registerSession = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Get device/browser info
      const deviceInfo = {
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase.functions.invoke('session-manager', {
        body: {
          action: 'register_session',
          session_id: sessionId,
          device_info: deviceInfo,
          user_agent: navigator.userAgent
        }
      });

      if (error) {
        console.error('Failed to register session:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Session registration error:', error);
      throw error;
    }
  }, [getSessionId]);

  // Validate current session
  const validateSession = useCallback(async () => {
    try {
      setIsValidating(true);
      const sessionId = getSessionId();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { valid: false, reason: 'No auth session' };
      }

      const { data, error } = await supabase.functions.invoke('session-manager', {
        body: {
          action: 'validate_session',
          session_id: sessionId
        }
      });

      if (error) {
        console.error('Session validation error:', error);
        return { valid: false, reason: 'Validation error' };
      }

      return data;
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, reason: 'Validation failed' };
    } finally {
      setIsValidating(false);
    }
  }, [getSessionId]);

  // Logout other sessions
  const logoutOtherSessions = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('session-manager', {
        body: {
          action: 'logout_other_sessions',
          session_id: sessionId
        }
      });

      if (error) {
        console.error('Failed to logout other sessions:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Logout other sessions error:', error);
      throw error;
    }
  }, [getSessionId]);

  // Clear current session
  const clearSession = useCallback(() => {
    localStorage.removeItem('app_session_id');
    setCurrentSessionId(null);
  }, []);

  // Initialize session ID on mount
  useEffect(() => {
    getSessionId();
  }, [getSessionId]);

  return {
    currentSessionId,
    isValidating,
    registerSession,
    validateSession,
    logoutOtherSessions,
    clearSession,
    generateSessionId
  };
};