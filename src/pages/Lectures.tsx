import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

const Lectures = () => {
  const [selectedLecture, setSelectedLecture] = useState(null);

  const categories = [
    { id: "gs", name: "General Studies", icon: BookOpen, color: "text-blue-600" },
    { id: "maths", name: "Mathematics", icon: Calculator, color: "text-green-600" },
    { id: "reasoning", name: "Reasoning", icon: Brain, color: "text-purple-600" },
    { id: "english", name: "English", icon: MessageSquare, color: "text-orange-600" },
  ];

  const lectures = {
    gs: [
      { id: 1, title: "Indian History - Ancient India", duration: "45 min", difficulty: "Beginner", rating: 4.8, views: "12.5k" },
      { id: 2, title: "Geography - Physical Features", duration: "52 min", difficulty: "Intermediate", rating: 4.9, views: "8.2k" },
      { id: 3, title: "Polity - Constitution Basics", duration: "38 min", difficulty: "Beginner", rating: 4.7, views: "15.3k" },
    ],
    maths: [
      { id: 4, title: "Algebra - Linear Equations", duration: "35 min", difficulty: "Intermediate", rating: 4.6, views: "9.8k" },
      { id: 5, title: "Geometry - Triangles", duration: "42 min", difficulty: "Advanced", rating: 4.8, views: "7.1k" },
      { id: 6, title: "Number System", duration: "28 min", difficulty: "Beginner", rating: 4.9, views: "18.7k" },
    ],
    reasoning: [
      { id: 7, title: "Logical Reasoning - Syllogisms", duration: "30 min", difficulty: "Intermediate", rating: 4.7, views: "11.2k" },
      { id: 8, title: "Analytical Reasoning", duration: "48 min", difficulty: "Advanced", rating: 4.6, views: "6.9k" },
      { id: 9, title: "Non-Verbal Reasoning", duration: "25 min", difficulty: "Beginner", rating: 4.8, views: "13.4k" },
    ],
    english: [
      { id: 10, title: "Grammar - Tenses", duration: "33 min", difficulty: "Beginner", rating: 4.7, views: "14.6k" },
      { id: 11, title: "Vocabulary Building", duration: "27 min", difficulty: "Intermediate", rating: 4.8, views: "10.3k" },
      { id: 12, title: "Reading Comprehension", duration: "40 min", difficulty: "Advanced", rating: 4.9, views: "8.8k" },
    ],
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const sampleSummary = {
    title: "AI-Generated Summary",
    content: "This lecture covers the fundamental concepts of Indian Ancient History, including the Indus Valley Civilization, Vedic Period, and the rise of major empires. Key topics include chronological order of dynasties, important cultural developments, and archaeological findings that shape our understanding of ancient Indian society.",
    keyPoints: [
      "Indus Valley Civilization characteristics and decline",
      "Vedic literature and social structure",
      "Mauryan Empire expansion and administration",
      "Cultural and religious developments"
    ]
  };

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
            <Tabs defaultValue="gs" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    <category.icon className={`h-4 w-4 ${category.color}`} />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  {lectures[category.id].map((lecture) => (
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
                                  {lecture.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {lecture.rating}
                                </span>
                                <span>{lecture.views} views</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getDifficultyColor(lecture.difficulty)}>
                            {lecture.difficulty}
                          </Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
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
                  <span>Duration: {selectedLecture.duration}</span>
                  <span>Difficulty: {selectedLecture.difficulty}</span>
                </div>
              )}
            </Card>

            {/* AI Summary */}
            {selectedLecture && (
              <Card className="p-6 border-0 shadow-card">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  {sampleSummary.title}
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {sampleSummary.content}
                  </p>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Key Learning Points:</h4>
                    <ul className="space-y-2">
                      {sampleSummary.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
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