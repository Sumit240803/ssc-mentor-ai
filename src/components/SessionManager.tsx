import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Smartphone, Clock, AlertTriangle } from 'lucide-react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSession {
  id: string;
  session_id: string;
  device_info: any;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSessionId, logoutOtherSessions, validateSession } = useSessionManager();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutOtherSessions = async () => {
    try {
      await logoutOtherSessions();
      await fetchSessions(); // Refresh the sessions list
      toast({
        title: "Success",
        description: "All other sessions have been logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout other sessions",
        variant: "destructive",
      });
    }
  };

  const handleValidateSession = async () => {
    try {
      const result = await validateSession();
      if (result.valid) {
        toast({
          title: "Session Valid",
          description: "Your current session is active and valid",
        });
      } else {
        toast({
          title: "Session Invalid",
          description: `Session validation failed: ${result.reason}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate session",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  if (!user) {
    return null;
  }

  const currentSession = sessions.find(s => s.session_id === currentSessionId);
  const otherSessions = sessions.filter(s => s.session_id !== currentSessionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Device Sessions
        </CardTitle>
        <CardDescription>
          Manage your active login sessions across devices. Only one device can be logged in at a time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading sessions...</div>
        ) : (
          <>
            {/* Current Session */}
            {currentSession && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Current Device</h4>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-4 w-4 mt-1" />
                    <div className="space-y-1 flex-1">
                      <div className="text-sm">
                        <strong>Platform:</strong> {currentSession.device_info?.platform || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Last active: {new Date(currentSession.updated_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Session ID: {currentSession.session_id.slice(-8)}
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleValidateSession}
                  className="w-full"
                >
                  Validate Current Session
                </Button>
              </div>
            )}

            {/* Other Sessions */}
            {otherSessions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Other Active Sessions ({otherSessions.length})
                    </h4>
                    <Badge variant="destructive">Unauthorized</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These sessions should have been automatically logged out. If you see any, please log them out immediately.
                  </p>
                  <div className="space-y-2">
                    {otherSessions.map((session) => (
                      <div key={session.id} className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                        <div className="flex items-start gap-3">
                          <Smartphone className="h-4 w-4 mt-1 text-destructive" />
                          <div className="space-y-1 flex-1">
                            <div className="text-sm">
                              <strong>Platform:</strong> {session.device_info?.platform || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Last active: {new Date(session.updated_at).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Session ID: {session.session_id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleLogoutOtherSessions}
                    className="w-full"
                  >
                    Logout All Other Sessions
                  </Button>
                </div>
              </>
            )}

            {sessions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active sessions found
              </div>
            )}

            <Separator />
            <div className="text-xs text-muted-foreground">
              <strong>Security Feature:</strong> Only one device can be logged in at a time. 
              When you log in from a new device, all other sessions are automatically terminated.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
