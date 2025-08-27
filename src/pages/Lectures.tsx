import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Calculator, 
  Brain, 
  MessageSquare,
  Star,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLectures } from "@/hooks/useLectures";

const Lectures = () => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { lectures, subjects, loading, getLecturesBySubject } = useLectures();

  const getSubjectIcon = (iconName: string) => {
    const icons = {
      BookOpen: BookOpen,
      Calculator: Calculator,
      Brain: Brain,
      MessageSquare: MessageSquare
    };
    return icons[iconName as keyof typeof icons] || BookOpen;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
            Video Lectures
          </h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive lessons designed to master your SSC preparation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lectures List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={subjects[0]?.name?.toLowerCase()} className="w-full">
              <TabsList className={`grid w-full mb-6 ${subjects.length <= 4 ? `grid-cols-${subjects.length}` : 'grid-cols-4'}`}>
                {subjects.map((subject: any) => {
                  const SubjectIcon = getSubjectIcon(subject.icon);
                  return (
                    <TabsTrigger 
                      key={subject.id} 
                      value={subject.name.toLowerCase()}
                      className="flex items-center gap-2"
                    >
                      <SubjectIcon className="h-4 w-4" style={{ color: subject.color_code }} />
                      <span className="hidden sm:inline">{subject.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {subjects.map((subject: any) => (
                <TabsContent key={subject.id} value={subject.name.toLowerCase()} className="space-y-4">
                  {getLecturesBySubject(subject.name).length > 0 ? (
                    getLecturesBySubject(subject.name).map((lecture: any) => (
                      <Card 
                        key={lecture.id} 
                        className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer border-0 shadow-card"
                        onClick={() => setSelectedLecture(lecture)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <PlayCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">
                                  {lecture.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {lecture.duration_minutes} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    4.8
                                  </span>
                                  <span>{lecture.view_count || 0} views</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getDifficultyColor(lecture.difficulty_level)}>
                              {lecture.difficulty_level}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No lectures available for {subject.name}</p>
                      <p className="text-sm">Check back later for new content!</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Video Player & Summary */}
          <div className="space-y-6">
            {/* Video Player */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">
                {selectedLecture ? selectedLecture.title : "Select a lecture to begin"}
              </h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                {selectedLecture ? (
                  <Button variant="hero" size="lg" className="gap-2">
                    <PlayCircle className="h-6 w-6" />
                    Play Lecture
                  </Button>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <PlayCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Choose a lecture from the list to start learning</p>
                  </div>
                )}
              </div>
              {selectedLecture && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Duration: {selectedLecture.duration_minutes} min</span>
                  <span>Difficulty: {selectedLecture.difficulty_level}</span>
                </div>
              )}
            </Card>

            {/* Lecture Description */}
            {selectedLecture && (
              <Card className="p-6 border-0 shadow-card">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  Lecture Overview
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedLecture.description || "This comprehensive lecture covers essential concepts and practical applications. Perfect for building a strong foundation in this subject area."}
                  </p>
                  {selectedLecture.tags && selectedLecture.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLecture.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;