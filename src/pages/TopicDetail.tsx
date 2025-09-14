import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Brain, 
  Download,
  ChevronLeft,
  MessageSquare
} from "lucide-react";
import { useLectures } from "@/hooks/useLectures";
import { useTopicSummary } from "@/hooks/useTopicSummary";
import { TopicChat } from "@/components/TopicChat";
import ReactMarkdown from 'react-markdown';

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

const TopicDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('id');
  
  const { topics, loading } = useLectures();
  const { summary, loading: summaryLoading } = useTopicSummary(contentId || '');
  const [topic, setTopic] = useState<TopicData | null>(null);

  useEffect(() => {
    if (contentId && topics.length > 0) {
      const foundTopic = topics.find(t => t.content_id === contentId);
      if (foundTopic) {
        setTopic(foundTopic);
      }
    }
  }, [contentId, topics]);

  const handleDownload = (url: string, filename: string) => {
    window.open(url, '_blank');
  };

  if (loading || summaryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Topic not found</h2>
            <p className="text-muted-foreground mb-4">The requested topic could not be found.</p>
            <Button onClick={() => navigate('/lectures')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Lectures
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/lectures')}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Lectures
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {topic.topic_info.filename.replace('.pdf', '')}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {topic.topic_info.subject}
                </span>
                <span>•</span>
                <span>{topic.topic_info.sub_subject}</span>
                <span>•</span>
                <span>{topic.topic_info.topic}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {topic.has_enhanced_summary && (
              <Badge variant="default">Enhanced Summary Available</Badge>
            )}
            {topic.has_standard_summary && (
              <Badge variant="outline">Standard Summary Available</Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* PDF Actions */}
            <Card className="p-6 border-0 shadow-card">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                PDF Content
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="flex-1 gap-2"
                  onClick={() => handleDownload(topic.storage_url, topic.topic_info.filename)}
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 gap-2"
                  onClick={() => window.open(topic.storage_url, '_blank')}
                >
                  <ExternalLink className="h-5 w-5" />
                  View Online
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-3">Topic Details</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div><strong>Subject:</strong> {topic.topic_info.subject}</div>
                  <div><strong>Sub-subject:</strong> {topic.topic_info.sub_subject}</div>
                  <div><strong>Topic:</strong> {topic.topic_info.topic}</div>
                  <div><strong>Subtopic:</strong> {topic.topic_info.subtopic}</div>
                </div>
              </div>
            </Card>

            {/* AI Summary */}
            <Card className="p-6 border-0 shadow-card">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-hero rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                AI-Generated Summary
              </h2>
              
              {summary ? (
                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold text-foreground mb-3 mt-4 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-semibold text-foreground mb-2 mt-3">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-medium text-foreground mb-2 mt-3">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-muted-foreground leading-relaxed mb-3 text-sm">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1 mb-3 text-muted-foreground text-sm">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1 mb-3 text-muted-foreground text-sm">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-muted-foreground ml-2 text-sm">
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground">
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground mb-3 text-sm">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {summary.enhanced_summary || topic.summary_preview}
                    </ReactMarkdown>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    {topic.has_enhanced_summary && (
                      <Badge variant="default">Enhanced Summary</Badge>
                    )}
                    {topic.has_standard_summary && (
                      <Badge variant="outline">Standard Summary</Badge>
                    )}
                  </div>
                  <Button 
                    onClick={() => {
                      const params = new URLSearchParams({
                        contentId: topic.content_id,
                        topicName: encodeURIComponent(topic.topic_info.filename.replace('.pdf', ''))
                      });
                      navigate(`/topic-summary?${params.toString()}`);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    View Full Summary
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>AI summary not available for this topic</p>
                  <p className="text-sm">Check back later for generated content!</p>
                </div>
              )}
            </Card>
          </div>

          {/* AI Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6 border-0 shadow-card">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  AI Chat Assistant
                </h2>
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Ask questions about <strong>{topic.topic_info.filename.replace('.pdf', '')}</strong> and get AI-powered answers based on the content.
                  </p>
                </div>
                <TopicChat 
                  contentId={topic.content_id}
                  topicName={topic.topic_info.filename.replace('.pdf', '')}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;