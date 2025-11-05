import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Volume2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioPlayer } from "@/components/AudioPlayer";

const LectureDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  const url = searchParams.get("url") || "";
  const fileName = searchParams.get("fileName") || "";
  const type = searchParams.get("type") || "";
  const subject = searchParams.get("subject") || "";
  const topic = searchParams.get("topic") || "";

  useEffect(() => {
    if (type.includes("text") && url) {
      fetchTextContent();
    } else {
      setLoading(false);
    }
  }, [url, type]);

  const fetchTextContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const text = await response.text();
      setContent(text);
    } catch (error) {
      console.error("Error fetching content:", error);
      setContent("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/lectures?subject=${encodeURIComponent(subject)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lectures
        </Button>

        <Card className="border-2">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              {type.includes("audio") ? (
                <Volume2 className="h-8 w-8 text-primary flex-shrink-0" />
              ) : (
                <FileText className="h-8 w-8 text-primary flex-shrink-0" />
              )}
              <div className="space-y-1 flex-1">
                <CardTitle className="text-2xl">{fileName}</CardTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{subject}</span>
                  <span>•</span>
                  <span>{topic}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {type.includes("audio") ? (
              <AudioPlayer src={url} title={fileName} />
            ) : type.includes("text") ? (
              <ScrollArea className="h-[600px] w-full rounded-lg border bg-card">
                <div className="p-8">
                  <div className="prose prose-base dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-base leading-loose tracking-wide">
                      {content}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  This file type cannot be previewed in browser.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LectureDetail;
