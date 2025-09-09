import { useEffect, useRef } from 'react';
import { useSessionManager } from './useSessionManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSessionValidator = () => {
  const { validateSession } = useSessionManager();
  const { user, signOut } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) {
      // Clear interval if user is not logged in
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up periodic session validation (every 5 minutes)
    const validatePeriodically = async () => {
      try {
        const result = await validateSession();
        if (!result.valid) {
          console.log('Session validation failed, signing out:', result.reason);
          await signOut();
        }
      } catch (error) {
        console.error('Session validation error:', error);
        // On validation error, sign out to be safe
        await signOut();
      }
    };

    // Initial validation after 30 seconds
    const initialTimeout = setTimeout(validatePeriodically, 30000);

    // Set up interval for periodic validation (5 minutes)
    intervalRef.current = setInterval(validatePeriodically, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, validateSession, signOut]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};