import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Calculator, 
  Brain, 
  MessageSquare,
  Download,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLectures } from "@/hooks/useLectures";
import { TopicChat } from "@/components/TopicChat";

interface TopicData {
  content_id: string;
  topic_info: {
    subject: string;
    sub_subject: string;
    topic: string;
    subtopic: string;
    filename: string;
  };
  has_enhanced_summary: boolean;
  has_standard_summary: boolean;
  summary_preview: string;
  storage_url: string;
}

const Lectures = () => {
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const { topics, subSubjects, loading, getTopicsBySubSubject } = useLectures();

  const getSubjectIcon = (subSubject: string) => {
    const icons: { [key: string]: any } = {
      "General Studies": BookOpen,
      "Mathematics": Calculator,
      "Reasoning": Brain,
      "English": MessageSquare
    };
    return icons[subSubject] || BookOpen;
  };

  const handleDownload = (url: string, filename: string) => {
    window.open(url, '_blank');
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
            Study Materials
          </h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive study content with AI-powered summaries for your exam preparation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Topics List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={subSubjects[0]?.toLowerCase().replace(/\s+/g, '-')} className="w-full">
              <TabsList className={`grid w-full mb-6 ${subSubjects.length <= 4 ? `grid-cols-${subSubjects.length}` : 'grid-cols-4'}`}>
                {subSubjects.map((subSubject: string) => {
                  const SubjectIcon = getSubjectIcon(subSubject);
                  return (
                    <TabsTrigger 
                      key={subSubject} 
                      value={subSubject.toLowerCase().replace(/\s+/g, '-')}
                      className="flex items-center gap-2"
                    >
                      <SubjectIcon className="h-4 w-4 text-primary" />
                      <span className="hidden sm:inline">{subSubject}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {subSubjects.map((subSubject: string) => (
                <TabsContent key={subSubject} value={subSubject.toLowerCase().replace(/\s+/g, '-')} className="space-y-4">
                  {getTopicsBySubSubject(subSubject).length > 0 ? (
                    getTopicsBySubSubject(subSubject).map((topic: TopicData) => (
                      <Card 
                        key={topic.content_id} 
                        className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer border-0 shadow-card"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">
                                  {topic.topic_info.filename.replace('.pdf', '')}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {topic.topic_info.topic}
                                  </span>
                                  <span>{topic.topic_info.subtopic}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {topic.has_enhanced_summary && (
                                <Badge variant="default">Enhanced Summary</Badge>
                              )}
                              {topic.has_standard_summary && (
                                <Badge variant="outline">Standard Summary</Badge>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No content available for {subSubject}</p>
                      <p className="text-sm">Check back later for new content!</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Content Actions & Summary */}
          <div className="space-y-6">
            {/* Content Actions */}
            <Card className="p-6 border-0 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">
                {selectedTopic ? selectedTopic.topic_info.filename.replace('.pdf', '') : "Select content to view"}
              </h3>
              <div className="flex flex-col gap-4 mb-4">
                {selectedTopic ? (
                  <div className="space-y-3">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full gap-2"
                      onClick={() => handleDownload(selectedTopic.storage_url, selectedTopic.topic_info.filename)}
                    >
                      <Download className="h-5 w-5" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full gap-2"
                      onClick={() => window.open(selectedTopic.storage_url, '_blank')}
                    >
                      <ExternalLink className="h-5 w-5" />
                      View Online
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Choose content from the list to access materials</p>
                  </div>
                )}
              </div>
              {selectedTopic && (
                <div className="space-y-2 text-sm text-muted-foreground border-t pt-4">
                  <div><strong>Subject:</strong> {selectedTopic.topic_info.subject}</div>
                  <div><strong>Topic:</strong> {selectedTopic.topic_info.topic}</div>
                  <div><strong>Subtopic:</strong> {selectedTopic.topic_info.subtopic}</div>
                </div>
              )}
            </Card>

            {/* AI Summary */}
            {selectedTopic && (
              <Card className="p-6 border-0 shadow-card">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  AI-Generated Summary
                </h3>
                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none">
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedTopic.summary_preview}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    {selectedTopic.has_enhanced_summary && (
                      <Badge variant="default">Enhanced Summary Available</Badge>
                    )}
                    {selectedTopic.has_standard_summary && (
                      <Badge variant="outline">Standard Summary Available</Badge>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* AI Chat for Selected Topic */}
            {selectedTopic && (
              <TopicChat 
                contentId={selectedTopic.content_id}
                topicName={selectedTopic.topic_info.filename.replace('.pdf', '')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;