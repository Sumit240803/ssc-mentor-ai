import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://sscb-backend-api.onrender.com';

const parseUserAgent = (userAgent: string) => {
  const getDevice = () => {
    if (/iPhone/.test(userAgent)) return userAgent.match(/iPhone[^;)]+/)?.[0] || 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android/.test(userAgent)) return userAgent.match(/Android[^;)]+/)?.[0] || 'Android Device';
    if (/Windows/.test(userAgent)) return 'Windows PC';
    if (/Macintosh/.test(userAgent)) return 'Mac';
    if (/Linux/.test(userAgent)) return 'Linux PC';
    return 'Unknown Device';
  };

  const getOS = () => {
    if (/Windows NT 10/.test(userAgent)) return 'Windows 10';
    if (/Windows NT/.test(userAgent)) return userAgent.match(/Windows NT [0-9.]+/)?.[0] || 'Windows';
    if (/Mac OS X/.test(userAgent)) return userAgent.match(/Mac OS X [0-9_]+/)?.[0]?.replace(/_/g, '.') || 'macOS';
    if (/iOS/.test(userAgent)) return userAgent.match(/OS [0-9_]+/)?.[0]?.replace(/_/g, '.') || 'iOS';
    if (/Android/.test(userAgent)) return userAgent.match(/Android [0-9.]+/)?.[0] || 'Android';
    if (/Linux/.test(userAgent)) return 'Linux';
    return 'Unknown OS';
  };

  const getBrowser = () => {
    if (/Edg\//.test(userAgent)) return userAgent.match(/Edg\/[0-9.]+/)?.[0]?.replace('Edg/', 'Edge ') || 'Edge';
    if (/Chrome\//.test(userAgent) && !/Edg/.test(userAgent)) return userAgent.match(/Chrome\/[0-9.]+/)?.[0]?.replace('Chrome/', 'Chrome ') || 'Chrome';
    if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) return userAgent.match(/Version\/[0-9.]+/)?.[0]?.replace('Version/', 'Safari ') || 'Safari';
    if (/Firefox\//.test(userAgent)) return userAgent.match(/Firefox\/[0-9.]+/)?.[0]?.replace('Firefox/', 'Firefox ') || 'Firefox';
    return 'Unknown Browser';
  };

  return {
    device: getDevice(),
    os: getOS(),
    browser: getBrowser()
  };
};

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

      const userAgent = navigator.userAgent;
      const deviceInfo = parseUserAgent(userAgent);

      const response = await fetch(`${API_BASE_URL}/sessions/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: session.access_token,
          user_agent: userAgent,
          device_info: deviceInfo
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