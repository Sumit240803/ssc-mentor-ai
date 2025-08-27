import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
import { useMotivation } from "@/hooks/useMotivation";

const Motivation = () => {
  const { dailyQuote, motivationalContent, userStats, loading } = useMotivation();

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 || diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays - 1} days ago`;
  };

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
                {dailyQuote ? (
                  <>
                    <blockquote className="text-xl text-muted-foreground italic leading-relaxed mb-4">
                      "{dailyQuote.content}"
                    </blockquote>
                    {dailyQuote.author && (
                      <cite className="text-primary font-semibold text-lg">
                        - {dailyQuote.author}
                      </cite>
                    )}
                    <div className="mt-4">
                      <Badge className={getCategoryColor(dailyQuote.category)}>
                        {dailyQuote.category}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    "Success is the sum of small efforts, repeated day in and day out."
                  </p>
                )}
              </div>
            </Card>

            {/* Motivation Feed */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Motivation Archive
              </h3>
              <div className="space-y-4">
                {motivationalContent.length > 0 ? (
                  motivationalContent.map((item: any) => {
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
                              <span className="text-sm text-muted-foreground">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                            {item.title && (
                              <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                            )}
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
                                {item.likes_count || 0}
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                Tap to save
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Quote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No motivational content available</p>
                    <p className="text-sm">Check back later for inspiration!</p>
                  </div>
                )}
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {userStats?.current_streak || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Study Streak</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {userStats?.motivation_score || 80}%
                    </div>
                    <div className="text-sm text-muted-foreground">Motivation Score</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {userStats?.lectures_completed || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Lectures Completed</div>
                  </div>
                </div>
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