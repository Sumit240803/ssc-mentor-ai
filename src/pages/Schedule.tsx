import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

const Schedule = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete GS Chapter 5 - Indian Economy", subject: "GS", time: "09:00 AM", duration: "45 min", completed: false, priority: "high" },
    { id: 2, title: "Math Practice Set 3 - Algebra", subject: "Maths", time: "11:00 AM", duration: "30 min", completed: true, priority: "medium" },
    { id: 3, title: "Reasoning Quiz - Logical Puzzles", subject: "Reasoning", time: "02:00 PM", duration: "20 min", completed: false, priority: "high" },
    { id: 4, title: "English Grammar - Tenses Practice", subject: "English", time: "04:00 PM", duration: "25 min", completed: false, priority: "low" },
    { id: 5, title: "GS Current Affairs Reading", subject: "GS", time: "06:00 PM", duration: "30 min", completed: false, priority: "medium" },
  ]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = new Date().getDay();

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case "GS": return Book;
      case "Maths": return Calculator;
      case "Reasoning": return Brain;
      case "English": return MessageSquare;
      default: return Book;
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case "GS": return "bg-blue-100 text-blue-800";
      case "Maths": return "bg-green-100 text-green-800";
      case "Reasoning": return "bg-purple-100 text-purple-800";
      case "English": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-300";
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  const weeklyGoals = [
    { goal: "Complete 5 GS chapters", progress: 60, total: 5, completed: 3 },
    { goal: "Solve 10 math practice sets", progress: 80, total: 10, completed: 8 },
    { goal: "Master 50 reasoning problems", progress: 40, total: 50, completed: 20 },
    { goal: "Learn 100 new English words", progress: 75, total: 100, completed: 75 },
  ];

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
                {tasks.map((task) => {
                  const SubjectIcon = getSubjectIcon(task.subject);
                  return (
                    <div 
                      key={task.id} 
                      className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)} ${
                        task.completed ? 'bg-muted/50' : 'bg-background'
                      } hover:shadow-card transition-all duration-300`}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox 
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <div className="p-2 rounded-lg bg-muted">
                          <SubjectIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge className={getSubjectColor(task.subject)}>
                              {task.subject}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.time}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {task.duration}
                            </span>
                          </div>
                        </div>
                        {task.completed && (
                          <CheckCircle className="h-5 w-5 text-secondary" />
                        )}
                      </div>
                    </div>
                  );
                })}
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
            {/* Weekly Goals */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Weekly Goals
              </h3>
              <div className="space-y-4">
                {weeklyGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{goal.goal}</span>
                      <span className="text-muted-foreground">{goal.completed}/{goal.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Study Streak */}
            <Card className="p-6 border-0 shadow-card bg-gradient-subtle">
              <div className="text-center">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">12 Days</h3>
                <p className="text-muted-foreground mb-4">Current Study Streak</p>
                <p className="text-sm text-muted-foreground">
                  Keep going! You're building great study habits.
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