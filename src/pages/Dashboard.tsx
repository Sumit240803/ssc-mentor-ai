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
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const todayTasks = [
    { id: 1, title: "Complete GS Chapter 5", completed: true, time: "45 min" },
    { id: 2, title: "Math Practice Set 3", completed: false, time: "30 min" },
    { id: 3, title: "Reasoning Quiz", completed: false, time: "20 min" },
  ];

  const recentLectures = [
    { id: 1, title: "Indian History - Mughal Empire", subject: "GS", duration: "45 min", progress: 100 },
    { id: 2, title: "Algebra Basics", subject: "Maths", duration: "35 min", progress: 75 },
    { id: 3, title: "Logical Reasoning", subject: "Reasoning", duration: "40 min", progress: 50 },
  ];

  const motivationalQuote = {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  };

  const stats = [
    { label: "Total Study Hours", value: "156", icon: Clock, color: "text-primary" },
    { label: "Lectures Completed", value: "43", icon: PlayCircle, color: "text-secondary" },
    { label: "Current Streak", value: "12 days", icon: Target, color: "text-orange-500" },
    { label: "Quiz Score Avg", value: "87%", icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
        <Card className="mb-8 p-6 bg-gradient-subtle border-0 shadow-card">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Quote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Daily Motivation</h3>
              <blockquote className="text-muted-foreground italic text-lg leading-relaxed">
                "{motivationalQuote.text}"
              </blockquote>
              <cite className="text-primary font-medium mt-2 block">
                - {motivationalQuote.author}
              </cite>
            </div>
          </div>
        </Card>

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
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`p-1 rounded-full ${task.completed ? 'bg-secondary' : 'bg-muted'}`}>
                    <CheckCircle className={`h-4 w-4 ${task.completed ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.time}</div>
                  </div>
                </div>
              ))}
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
              {recentLectures.map((lecture) => (
                <div key={lecture.id} className="p-4 rounded-lg border hover:shadow-card transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{lecture.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {lecture.subject}
                        </span>
                        <span>{lecture.duration}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{lecture.progress}%</span>
                    </div>
                    <Progress value={lecture.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
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