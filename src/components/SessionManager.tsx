import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

interface UserSession {
  session_id: string;
  user_agent: string;
  created_at: string;
  last_activity: string;
}

export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { getActiveSessions, validateSession, isValidating } = useSessionManager();
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const activeSessions = await getActiveSessions();
      setSessions(activeSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleValidateSession = async () => {
    try {
      const result = await validateSession();
      if (result.valid) {
        if (result.multiple_sessions) {
          toast({
            title: "Multiple Sessions Detected",
            description: "Old session has been automatically logged out",
            variant: "default",
          });
        } else {
          toast({
            title: "Valid Session",
            description: "Your current session is valid and active",
          });
        }
        await fetchSessions();
      } else {
        toast({
          title: "Invalid Session",
          description: result.reason || "Session validation failed",
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

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Active Sessions
        </CardTitle>
        <CardDescription>
          Manage your active login sessions - only one session allowed per user
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {sessions.length > 0 ? (
              <>
                <div className="space-y-2">
                  {sessions.map((session, index) => (
                    <div 
                      key={session.session_id} 
                      className={`rounded-lg border p-4 ${index === 0 ? 'bg-accent/5' : 'bg-destructive/5'}`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {index === 0 ? 'Current Session' : 'Old Session (Will be logged out)'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.user_agent}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(session.created_at).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {new Date(session.last_activity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleValidateSession}
                  disabled={isValidating}
                  className="w-full"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Check for Multiple Sessions'
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active sessions found</p>
              </div>
            )}

            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">Security Feature: Single Session Per User</p>
              <p>
                For your security, this application enforces one active session per user. 
                If you log in from a new device or browser, the old session will be automatically 
                logged out. This prevents unauthorized access to your account.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
