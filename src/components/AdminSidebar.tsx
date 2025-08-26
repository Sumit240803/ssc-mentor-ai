import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  BookOpen, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Overview and stats"
    },
    {
      title: "Users",
      href: "/admin/users", 
      icon: Users,
      description: "Manage user accounts"
    },
    {
      title: "Lectures",
      href: "/admin/lectures",
      icon: Video,
      description: "Manage video content"
    },
    {
      title: "Subjects",
      href: "/admin/subjects",
      icon: BookOpen,
      description: "Organize course subjects"
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      description: "Platform insights"
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      description: "System configuration"
    }
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "bg-background border-r border-border h-screen flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Admin Panel</div>
                <div className="text-xs text-muted-foreground">LearnSSC</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant={isActive(item.href) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3",
                isCollapsed && "px-3"
              )}
            >
              <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <div className="text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              )}
            </Button>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  <Shield className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {user?.user_metadata?.full_name || "Admin"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link to="/dashboard" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Student View
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Avatar className="h-8 w-8 mx-auto">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                <Shield className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;