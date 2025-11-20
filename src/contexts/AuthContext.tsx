import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'Session user:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Register session on sign in
        if (event === 'SIGNED_IN' && session) {
          setTimeout(async () => {
            try {
              const userAgent = navigator.userAgent;
              const deviceInfo = parseUserAgent(userAgent);
              
              const response = await fetch('https://sscb-backend-api.onrender.com/sessions/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  access_token: session.access_token,
                  user_agent: userAgent,
                  device_info: deviceInfo
                })
              });
              if (!response.ok) {
                console.error('Failed to register session');
              }
            } catch (error) {
              console.error('Session registration error:', error);
            }
          }, 0);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName || email.split('@')[0]
          }
        }
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Logout session from backend
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        try {
          await fetch('https://sscb-backend-api.onrender.com/sessions/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: session.access_token })
          });
        } catch (err) {
          console.error('Failed to logout session from backend:', err);
        }
      }

      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setSession(null);
      }
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};