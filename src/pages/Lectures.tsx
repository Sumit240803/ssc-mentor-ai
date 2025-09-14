import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  FileText, 
  BookOpen, 
  Calculator, 
  Brain, 
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { useLectures } from "@/hooks/useLectures";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { subSubjects, loading, getTopicsBySubSubject } = useLectures();

  const getSubjectIcon = (subSubject: string) => {
    const icons: { [key: string]: any } = {
      "General Studies": BookOpen,
      "Mathematics": Calculator,
      "Reasoning": Brain,
      "English": MessageSquare
    };
    return icons[subSubject] || BookOpen;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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

        {/* Topics List */}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getTopicsBySubSubject(subSubject).map((topic: TopicData) => (
                    <Card 
                      key={topic.content_id} 
                      className="p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer border-0 shadow-card group"
                      onClick={() => navigate(`/topic?id=${topic.content_id}`)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-lg line-clamp-2">
                              {topic.topic_info.filename.replace('.pdf', '')}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span className="truncate">{topic.topic_info.topic}</span>
                          </div>
                          <div className="truncate">{topic.topic_info.subtopic}</div>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                          {topic.has_enhanced_summary && (
                            <Badge variant="default" className="text-xs">Enhanced</Badge>
                          )}
                          {topic.has_standard_summary && (
                            <Badge variant="outline" className="text-xs">Standard</Badge>
                          )}
                        </div>
                        
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {topic.summary_preview}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-primary font-medium">View Details</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No content available for {subSubject}</p>
                  <p className="text-sm">Check back later for new content!</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Lectures;