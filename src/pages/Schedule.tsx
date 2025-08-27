import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  Target,
  TrendingUp,
  Book,
  Calculator,
  Brain,
  MessageSquare
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSchedule } from "@/hooks/useSchedule";

const Schedule = () => {
  const { tasks, userStats, loading, toggleTask } = useSchedule();

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = new Date().getDay();

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not scheduled';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('math')) return Calculator;
    if (subjectLower.includes('reasoning')) return Brain;
    if (subjectLower.includes('english')) return MessageSquare;
    return Book;
  };

  const getSubjectColor = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('math')) return "bg-green-100 text-green-800";
    if (subjectLower.includes('reasoning')) return "bg-purple-100 text-purple-800";
    if (subjectLower.includes('english')) return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-300";
    }
  };

  const completedTasks = tasks.filter((task: any) => task.is_completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Study Schedule
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay on track with your personalized learning plan
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Progress */}
            <Card className="p-6 border-0 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Today's Schedule
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{completedTasks}/{totalTasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks completed</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Daily Progress</span>
                  <span className="text-foreground font-medium">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-hero h-3 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task: any) => {
                    const SubjectIcon = getSubjectIcon(task.subject);
                    return (
                      <div 
                        key={task.id} 
                        className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)} ${
                          task.is_completed ? 'bg-muted/50' : 'bg-background'
                        } hover:shadow-card transition-all duration-300`}
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox 
                            checked={task.is_completed}
                            onCheckedChange={() => toggleTask(task.id)}
                          />
                          <div className="p-2 rounded-lg bg-muted">
                            <SubjectIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge className={getSubjectColor(task.subject)}>
                                {task.subject}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(task.scheduled_time)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {task.duration_minutes} min
                              </span>
                            </div>
                          </div>
                          {task.is_completed && (
                            <CheckCircle className="h-5 w-5 text-secondary" />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks scheduled for today</p>
                    <p className="text-sm">Add some tasks to get started!</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Weekly Overview */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Overview
              </h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day, index) => (
                  <div 
                    key={day}
                    className={`text-center p-3 rounded-lg ${
                      index === currentDay - 1 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="text-xs font-medium">{day}</div>
                    <div className="text-lg font-bold mt-1">{index + 18}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Your Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Study Hours</span>
                  <span className="text-2xl font-bold text-foreground">
                    {userStats?.study_hours_total || 0}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lectures Completed</span>
                  <span className="text-2xl font-bold text-foreground">
                    {userStats?.lectures_completed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tasks Today</span>
                  <span className="text-2xl font-bold text-foreground">
                    {userStats?.tasks_completed_today || 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Study Streak */}
            <Card className="p-6 border-0 shadow-card bg-gradient-subtle">
              <div className="text-center">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {userStats?.current_streak || 0} Days
                </h3>
                <p className="text-muted-foreground mb-4">Current Study Streak</p>
                <p className="text-sm text-muted-foreground">
                  {(userStats?.current_streak || 0) > 0 
                    ? "Keep going! You're building great study habits."
                    : "Start your study streak today!"
                  }
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="soft" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Add New Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Study Timer
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;