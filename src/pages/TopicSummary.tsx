import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTopicSummary } from '@/hooks/useTopicSummary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Brain, FileText } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';

export default function TopicSummary() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const contentId = searchParams.get('contentId');
  const topicName = searchParams.get('topicName');
  
  const { summary, loading, error } = useTopicSummary(contentId);

  const handleBack = () => {
    navigate('/lectures');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Lectures
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Summary</h1>
                {topicName && (
                  <p className="text-muted-foreground">{decodeURIComponent(topicName)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <Card className="p-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading AI summary...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-destructive mb-2">Failed to load summary</p>
                <p className="text-muted-foreground text-sm">{error}</p>
              </div>
            )}

            {summary && (
              <div className="space-y-6">
                {/* Topic Info */}
                <div className="border-b pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Subject:</span>
                      <p className="text-muted-foreground">{summary.topic_info.subject}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Topic:</span>
                      <p className="text-muted-foreground">{summary.topic_info.topic}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Subtopic:</span>
                      <p className="text-muted-foreground">{summary.topic_info.subtopic}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">File:</span>
                      <p className="text-muted-foreground">{summary.topic_info.filename}</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Summary */}
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-foreground mb-3 mt-5">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-foreground leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-foreground">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-foreground ml-4">
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      ),
                      code: ({ children }) => (
                        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {summary.enhanced_summary}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}