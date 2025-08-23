import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Quote, 
  Heart, 
  TrendingUp, 
  Star,
  BookOpen,
  Target,
  Lightbulb,
  Trophy
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Motivation = () => {
  const todayQuote = {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Perseverance"
  };

  const motivationalContent = [
    {
      id: 1,
      type: "quote",
      content: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
      category: "Growth",
      date: "Today",
      likes: 156
    },
    {
      id: 2,
      type: "tip",
      content: "Break down complex topics into smaller, manageable chunks. This makes learning less overwhelming and more effective.",
      category: "Study Tips",
      date: "Yesterday",
      likes: 203
    },
    {
      id: 3,
      type: "success",
      content: "Rahul from Delhi secured AIR 15 in SSC CGL 2023 after following a consistent study schedule for 8 months!",
      category: "Success Story",
      date: "2 days ago",
      likes: 89
    },
    {
      id: 4,
      type: "quote",
      content: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
      category: "Education",
      date: "3 days ago",
      likes: 312
    },
    {
      id: 5,
      type: "tip",
      content: "Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. This improves focus and retention.",
      category: "Study Tips",
      date: "4 days ago",
      likes: 178
    },
    {
      id: 6,
      type: "quote",
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Passion",
      date: "5 days ago",
      likes: 245
    }
  ];

  const getContentIcon = (type) => {
    switch (type) {
      case "quote": return Quote;
      case "tip": return Lightbulb;
      case "success": return Trophy;
      default: return BookOpen;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case "quote": return "bg-primary/10 text-primary";
      case "tip": return "bg-secondary/10 text-secondary";
      case "success": return "bg-orange-100 text-orange-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Growth": return "bg-green-100 text-green-800";
      case "Study Tips": return "bg-blue-100 text-blue-800";
      case "Success Story": return "bg-orange-100 text-orange-800";
      case "Education": return "bg-purple-100 text-purple-800";
      case "Passion": return "bg-pink-100 text-pink-800";
      case "Perseverance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    { label: "Days Active", value: "45", icon: Target },
    { label: "Goals Achieved", value: "23", icon: Trophy },
    { label: "Study Streak", value: "12", icon: TrendingUp },
    { label: "Motivation Score", value: "94%", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Daily Motivation
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay inspired and motivated on your SSC journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Inspiration */}
            <Card className="p-8 bg-gradient-subtle border-0 shadow-elevated">
              <div className="text-center">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
                  <Quote className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Today's Inspiration</h2>
                <blockquote className="text-xl text-muted-foreground italic leading-relaxed mb-4">
                  "{todayQuote.text}"
                </blockquote>
                <cite className="text-primary font-semibold text-lg">
                  - {todayQuote.author}
                </cite>
                <div className="mt-4">
                  <Badge className={getCategoryColor(todayQuote.category)}>
                    {todayQuote.category}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Motivation Feed */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Motivation Archive
              </h3>
              <div className="space-y-4">
                {motivationalContent.map((item) => {
                  const ContentIcon = getContentIcon(item.type);
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-lg border hover:shadow-card transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getContentColor(item.type)}`}>
                          <ContentIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                          <p className="text-foreground leading-relaxed mb-3">
                            {item.content}
                          </p>
                          {item.author && (
                            <cite className="text-primary font-medium">
                              - {item.author}
                            </cite>
                          )}
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                              <Heart className="h-4 w-4 mr-1" />
                              {item.likes}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              Tap to save
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Motivation Stats */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Your Progress
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Motivation */}
            <Card className="p-6 border-0 shadow-card bg-gradient-hero text-white">
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quick Boost</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  "Every small step you take today brings you closer to your SSC success tomorrow."
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Get Daily Reminder
                </Button>
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Browse by Category</h3>
              <div className="space-y-2">
                {["Study Tips", "Success Stories", "Quotes", "Goal Setting", "Mindset"].map((category) => (
                  <Button 
                    key={category} 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Achievement Badge */}
            <Card className="p-6 border-0 shadow-card text-center bg-secondary-light">
              <Trophy className="h-12 w-12 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Consistency Champion</h3>
              <p className="text-sm text-muted-foreground">
                You've checked motivation for 7 days straight!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Motivation;