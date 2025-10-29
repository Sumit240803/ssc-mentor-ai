import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, GraduationCap, Brain, Atom, Volume2 } from "lucide-react";
import { useLectures } from "@/hooks/useLectures";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigate } from "react-router-dom";

interface LectureFile {
  subject: string;
  topic: string;
  file_name: string;
  url: string;
  type: string;
  size: number;
}

const Lectures = () => {
  const navigate = useNavigate();
  const { subjects, loading, getLecturesBySubject, fetchLecturesBySubject, isLoadingSubject } = useLectures();
  const [activeSubject, setActiveSubject] = useState<string>("");

  useEffect(() => {
    if (subjects.length > 0 && !activeSubject) {
      setActiveSubject(subjects[0]);
      fetchLecturesBySubject(subjects[0]);
    }
  }, [subjects]);

  const handleTabChange = (subject: string) => {
    setActiveSubject(subject);
    fetchLecturesBySubject(subject);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes("computer")) return <Brain className="h-5 w-5" />;
    if (subjectLower.includes("science")) return <Atom className="h-5 w-5" />;
    if (subjectLower.includes("affair") || subjectLower.includes("politic")) return <BookOpen className="h-5 w-5" />;
    return <GraduationCap className="h-5 w-5" />;
  };

  const getFileIcon = (type: string) => {
    if (type.includes("audio")) return <Volume2 className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };


  const handleLectureClick = (lecture: LectureFile) => {
    navigate(`/lecture-detail?url=${encodeURIComponent(lecture.url)}&fileName=${encodeURIComponent(lecture.file_name)}&type=${encodeURIComponent(lecture.type)}&subject=${encodeURIComponent(lecture.subject)}&topic=${encodeURIComponent(lecture.topic)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Study Materials
          </h1>
          <p className="text-muted-foreground">
            Access comprehensive lecture notes and study materials organized by subject
          </p>
        </div>

        <Tabs value={activeSubject} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-card/50 backdrop-blur-sm p-2">
            {subjects.map((subject) => (
              <TabsTrigger
                key={subject}
                value={subject}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {getSubjectIcon(subject)}
                <span className="font-medium">{subject}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => {
            const subjectLectures = getLecturesBySubject(subject);
            const isLoading = isLoadingSubject(subject);

            return (
              <TabsContent key={subject} value={subject} className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : subjectLectures.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center">
                        No content available for this subject yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjectLectures.map((lecture, index) => (
                      <Card
                        key={index}
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                        onClick={() => handleLectureClick(lecture)}
                      >
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 flex-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                                {lecture.file_name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                <div className="font-medium text-foreground/80">
                                  {lecture.topic}
                                </div>
                              </CardDescription>
                            </div>
                            {getFileIcon(lecture.type)}
                          </div>
                          
                          <Badge variant="secondary" className="gap-1">
                            {lecture.type.includes('audio') ? 'Audio' : lecture.type.includes('text') ? 'Text' : 'Document'}
                          </Badge>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default Lectures;
