import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, GraduationCap, Brain, Atom, Volume2, Headphones, FolderOpen } from "lucide-react";
import { useLectures } from "@/hooks/useLectures";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SubjectAIChat } from "@/components/SubjectAIChat";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FeatureInfoModal from "@/components/FeatureInfoModal";

interface FileItem {
  file_name: string;
  url: string;
  type: string;
  size: number;
}

interface LectureTopic {
  subject: string;
  section: string;
  topic: string;
  files: FileItem[];
}

const Lectures = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { subjects, loading, getLecturesBySubject, fetchLecturesBySubject, isLoadingSubject } = useLectures();
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [activeSections, setActiveSections] = useState<Record<string, string[]>>({});
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  // Initialize with URL parameter or first subject
  useEffect(() => {
    if (subjects.length === 0) return;
    
    const subjectParam = searchParams.get("subject");
    if (subjectParam && subjects.includes(subjectParam) && activeSubject !== subjectParam) {
      setActiveSubject(subjectParam);
      fetchLecturesBySubject(subjectParam);
    } else if (!activeSubject && subjects.length > 0) {
      setActiveSubject(subjects[0]);
      fetchLecturesBySubject(subjects[0]);
    }
  }, [subjects, searchParams, fetchLecturesBySubject, activeSubject]);

  // Show feature modal when component mounts (first visit to lectures page)
  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenFeatureModal');
    if (!hasSeenModal && !loading && subjects.length > 0) {
      const timer = setTimeout(() => {
        setShowFeatureModal(true);
        localStorage.setItem('hasSeenFeatureModal', 'true');
      }, 1000); // Small delay to let the page load
      
      return () => clearTimeout(timer);
    }
  }, [loading, subjects]);

  // Helper function to extract serial number from topic name
  const extractSerialNumber = (topic: string): number | null => {
    const match = topic.match(/^(\d+)\./);
    return match ? parseInt(match[1], 10) : null;
  };

  // Helper function to sort topics by serial number
  const sortTopicsBySerial = (topics: LectureTopic[]): LectureTopic[] => {
    return [...topics].sort((a, b) => {
      const serialA = extractSerialNumber(a.topic);
      const serialB = extractSerialNumber(b.topic);
      
      // If both have serial numbers, sort numerically
      if (serialA !== null && serialB !== null) {
        return serialA - serialB;
      }
      
      // If only one has a serial number, put it first
      if (serialA !== null) return -1;
      if (serialB !== null) return 1;
      
      // If neither has a serial number, keep original order
      return 0;
    });
  };

  const groupLecturesBySection = (lectures: LectureTopic[]) => {
    const withSections: Record<string, LectureTopic[]> = {};
    const withoutSections: LectureTopic[] = [];
    
    lectures.forEach(lecture => {
      if (lecture.section && lecture.section.trim() !== '') {
        if (!withSections[lecture.section]) {
          withSections[lecture.section] = [];
        }
        withSections[lecture.section].push(lecture);
      } else {
        withoutSections.push(lecture);
      }
    });
    
    // Sort topics within each section by serial number
    Object.keys(withSections).forEach(section => {
      withSections[section] = sortTopicsBySerial(withSections[section]);
    });
    
    // Sort topics without sections by serial number
    const sortedWithoutSections = sortTopicsBySerial(withoutSections);
    
    return { withSections, withoutSections: sortedWithoutSections };
  };

  const handleTabChange = (subject: string) => {
    console.log(`Switching to tab: ${subject}, current: ${activeSubject}`);
    // Always update state and fetch data to ensure tab switching works
    setActiveSubject(subject);
    // Small delay to ensure state update
    setTimeout(() => {
      fetchLecturesBySubject(subject);
    }, 10);
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

  const handleFileClick = (file: FileItem, topic: LectureTopic) => {
    navigate(`/lecture-detail?url=${encodeURIComponent(file.url)}&fileName=${encodeURIComponent(file.file_name)}&type=${encodeURIComponent(file.type)}&subject=${encodeURIComponent(topic.subject)}&topic=${encodeURIComponent(topic.topic)}`);
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

        {/* Feature Info Modal */}
        <FeatureInfoModal 
          open={showFeatureModal} 
          onOpenChange={setShowFeatureModal} 
        />

        <Tabs key={activeSubject} value={activeSubject} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-card/50 backdrop-blur-sm p-2">
            {subjects.map((subject) => (
              <TabsTrigger
                key={subject}
                value={subject}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                disabled={false}
              >
                {getSubjectIcon(subject)}
                <span className="font-medium">{subject}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => {
            const subjectLectures = getLecturesBySubject(subject);
            const isLoading = isLoadingSubject(subject);
            const { withSections, withoutSections } = groupLecturesBySection(subjectLectures);
            const sections = Object.keys(withSections);
            const hasSections = sections.length > 0;

            const renderTopicCard = (topic: LectureTopic, index: number) => {
              // Group files by language
              const englishFiles = topic.files.filter(f => 
                f.url.includes('/English/') || 
                (!f.url.includes('/Hindi/') && !f.file_name.toLowerCase().includes('hindi'))
              );
              const hindiFiles = topic.files.filter(f => 
                f.url.includes('/Hindi/') || 
                f.file_name.toLowerCase().includes('hindi')
              );

              const hasMultipleLanguages = englishFiles.length > 0 && hindiFiles.length > 0;

              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="space-y-3">
                    <div className="space-y-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {topic.topic}
                      </CardTitle>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-2">
                      {hasMultipleLanguages ? (
                        <>
                          {/* English Section */}
                          {englishFiles.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-medium text-muted-foreground px-1">English</p>
                              <div className="flex gap-2">
                                {englishFiles.some(f => !f.type?.includes('audio')) && (
                                  <Button
                                    variant="outline"
                                    className="flex-1 justify-start gap-2"
                                    onClick={() => handleFileClick(
                                      englishFiles.find(f => !f.type?.includes('audio'))!,
                                      topic
                                    )}
                                  >
                                    <FileText className="h-4 w-4" />
                                    Notes
                                  </Button>
                                )}
                                {englishFiles.some(f => f.type?.includes('audio')) && (
                                  <Button
                                    variant="outline"
                                    className="flex-1 justify-start gap-2"
                                    onClick={() => handleFileClick(
                                      englishFiles.find(f => f.type?.includes('audio'))!,
                                      topic
                                    )}
                                  >
                                    <Headphones className="h-4 w-4" />
                                    Audio
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Hindi Section */}
                          {hindiFiles.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-medium text-muted-foreground px-1">हिंदी (Hindi)</p>
                              <div className="flex gap-2">
                                {hindiFiles.some(f => !f.type?.includes('audio')) && (
                                  <Button
                                    variant="outline"
                                    className="flex-1 justify-start gap-2"
                                    onClick={() => handleFileClick(
                                      hindiFiles.find(f => !f.type?.includes('audio'))!,
                                      topic
                                    )}
                                  >
                                    <FileText className="h-4 w-4" />
                                    Notes
                                  </Button>
                                )}
                                {hindiFiles.some(f => f.type?.includes('audio')) && (
                                  <Button
                                    variant="outline"
                                    className="flex-1 justify-start gap-2"
                                    onClick={() => handleFileClick(
                                      hindiFiles.find(f => f.type?.includes('audio'))!,
                                      topic
                                    )}
                                  >
                                    <Headphones className="h-4 w-4" />
                                    Audio
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Single language version (original behavior) */}
                          {topic.files.some(f => !f.type?.includes('audio')) && (
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2"
                              onClick={() => handleFileClick(
                                topic.files.find(f => !f.type?.includes('audio'))!,
                                topic
                              )}
                            >
                              <FileText className="h-4 w-4" />
                              Read Notes
                            </Button>
                          )}
                          {topic.files.some(f => f.type?.includes('audio')) && (
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2"
                              onClick={() => handleFileClick(
                                topic.files.find(f => f.type?.includes('audio'))!,
                                topic
                              )}
                            >
                              <Headphones className="h-4 w-4" />
                              Listen Audio
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              );
            };

            return (
              <TabsContent key={`${subject}-${activeSubject}`} value={subject} className="mt-6">
                <div className="flex justify-end mb-4">
                  <SubjectAIChat subject={subject} />
                </div>
                {isLoading && (!subjectLectures || subjectLectures.length === 0) ? (
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
                  <>
                    {hasSections && (
                      <Accordion 
                        type="multiple" 
                        value={activeSections[subject] || [sections[0]]} 
                        onValueChange={(value) => setActiveSections(prev => ({ ...prev, [subject]: value }))}
                        className="space-y-4"
                      >
                        {sections.map((section) => (
                          <AccordionItem 
                            key={section} 
                            value={section}
                            className="border-2 rounded-lg bg-card/50 backdrop-blur-sm px-6"
                          >
                            <AccordionTrigger className="hover:no-underline py-4">
                              <div className="flex items-center gap-3">
                                <FolderOpen className="h-5 w-5 text-primary" />
                                <span className="text-lg font-semibold">{section}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {withSections[section].length} topics
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {withSections[section].map(renderTopicCard)}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}

                    {withoutSections.length > 0 && (
                      <div className={hasSections ? "mt-6" : ""}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {withoutSections.map(renderTopicCard)}
                        </div>
                      </div>
                    )}
                  </>
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
