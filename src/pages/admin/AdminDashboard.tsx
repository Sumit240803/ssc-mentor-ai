import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  UserPlus,
  Video,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/AdminSidebar";

interface AdminStats {
  total_users: number;
  total_profiles: number;
  total_posts: number;
  total_lectures: number;
  published_lectures: number;
  total_subjects: number;
  recent_signups: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) throw error;
      
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setStats(data as unknown as AdminStats);
      }
    } catch (error: any) {
      toast({
        title: "Error loading stats",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      change: `+${stats?.recent_signups || 0} this week`
    },
    {
      title: "Total Lectures",
      value: stats?.total_lectures || 0,
      icon: Video,
      color: "text-green-500", 
      bgColor: "bg-green-50",
      change: `${stats?.published_lectures || 0} published`
    },
    {
      title: "Active Subjects",
      value: stats?.total_subjects || 0,
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      change: "All active"
    },
    {
      title: "User Posts",
      value: stats?.total_posts || 0,
      icon: BarChart3,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      change: "Total created"
    }
  ];

  const quickActions = [
    {
      title: "Add New Lecture",
      description: "Create and publish video lectures",
      icon: Video,
      href: "/admin/lectures/new",
      color: "bg-primary"
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
      color: "bg-secondary"
    },
    {
      title: "Subject Management",
      description: "Organize lecture subjects",
      icon: BookOpen,
      href: "/admin/subjects",
      color: "bg-green-500"
    },
    {
      title: "Analytics",
      description: "View detailed platform analytics",
      icon: TrendingUp,
      href: "/admin/analytics",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your SSC learning platform
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="p-6 border-0 shadow-card hover:shadow-elevated transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {loading ? "--" : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Card className="p-4 hover:shadow-elevated transition-all duration-300 cursor-pointer group border-0 shadow-card">
                      <div className="text-center">
                        <div className={`p-3 rounded-full w-fit mx-auto mb-3 ${action.color}`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                  <div className="p-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-green-800">All Systems Operational</div>
                    <div className="text-sm text-green-600">Database and storage running smoothly</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-blue-800">Backup Completed</div>
                    <div className="text-sm text-blue-600">Last backup: Today at 3:00 AM</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-medium text-yellow-800">Maintenance Scheduled</div>
                    <div className="text-sm text-yellow-600">Next maintenance: This Sunday 2:00 AM</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Users Table */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                Recent User Registrations
              </h3>
              <Link to="/admin/users">
                <Button variant="soft" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>User management table will be loaded here</p>
              <p className="text-sm">Click "View All" to see detailed user management</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;