import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Clock,
  PlayCircle,
  CheckCircle,
  Target,
  Quote
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { 
    todayTasks, 
    recentLectures, 
    dailyQuote, 
    userStats, 
    loading, 
    toggleTask 
  } = useDashboardData();

  const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const stats = userStats ? [
    { label: "Total Study Hours", value: userStats.study_hours_total.toString(), icon: Clock, color: "text-primary" },
    { label: "Lectures Completed", value: userStats.lectures_completed.toString(), icon: PlayCircle, color: "text-secondary" },
    { label: "Current Streak", value: `${userStats.current_streak} days`, icon: Target, color: "text-orange-500" },
    { label: "Tasks Completed", value: userStats.tasks_completed_today.toString(), icon: TrendingUp, color: "text-green-500" },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">Loading your dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, Student! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to continue your SSC journey? Let's make today count.
          </p>
        </div>

        {/* Daily Motivation */}
        {dailyQuote && (
          <Card className="mb-8 p-6 bg-gradient-subtle border-0 shadow-card">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Quote className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Daily Motivation</h3>
                <blockquote className="text-muted-foreground italic text-lg leading-relaxed">
                  "{dailyQuote.content}"
                </blockquote>
                {dailyQuote.author && (
                  <cite className="text-primary font-medium mt-2 block">
                    - {dailyQuote.author}
                  </cite>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-elevated transition-all duration-300 border-0 shadow-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Tasks */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Tasks
              </h3>
              <Link to="/schedule">
                <Button variant="soft" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={`p-1 rounded-full ${task.is_completed ? 'bg-secondary' : 'bg-muted'}`}>
                      <CheckCircle className={`h-4 w-4 ${task.is_completed ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.scheduled_time ? formatTime(task.scheduled_time) : ''} • {task.duration_minutes} min
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No tasks scheduled for today</p>
                  <Link to="/schedule">
                    <Button variant="soft" size="sm" className="mt-2">
                      Add Tasks
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Lectures */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Continue Learning
              </h3>
              <Link to="/lectures">
                <Button variant="soft" size="sm">
                  Browse All
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentLectures.length > 0 ? (
                recentLectures.map((lecture: any, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:shadow-card transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-foreground line-clamp-1">{lecture.file_name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {lecture.subject}
                          </span>
                          <span className="text-xs">{(lecture.size / 1024).toFixed(0)} KB</span>
                        </div>
                      </div>
                      <Link to={`/lecture-detail?url=${encodeURIComponent(lecture.url)}&fileName=${encodeURIComponent(lecture.file_name)}&type=${encodeURIComponent(lecture.type)}&subject=${encodeURIComponent(lecture.subject)}&topic=${encodeURIComponent(lecture.topic)}`}>
                        <Button variant="ghost" size="sm">
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {lecture.topic}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No lectures available</p>
                  <Link to="/lectures">
                    <Button variant="soft" size="sm" className="mt-2">
                      Browse Lectures
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Link to="/lectures">
            <Card className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group border-0 shadow-card">
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Start Learning</h3>
                <p className="text-muted-foreground text-sm">Browse video lectures by subject</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/mock-test">
            <Card className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group border-0 shadow-card">
              <div className="text-center">
                <div className="p-3 bg-green-500/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Target className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Mock Test</h3>
                <p className="text-muted-foreground text-sm">Practice with 100 questions</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/schedule">
            <Card className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group border-0 shadow-card">
              <div className="text-center">
                <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Study Schedule</h3>
                <p className="text-muted-foreground text-sm">Plan your learning journey</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/motivation">
            <Card className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group border-0 shadow-card">
              <div className="text-center">
                <div className="p-3 bg-orange-500/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Stay Motivated</h3>
                <p className="text-muted-foreground text-sm">Daily inspiration and tips</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;