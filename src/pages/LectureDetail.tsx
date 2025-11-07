import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Volume2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioPlayer } from "@/components/AudioPlayer";

interface TimestampData {
  start: number;
  end: number;
  word: string;
  confidence: number;
}

interface AlignmentResponse {
  subject: string;
  topic: string;
  language: string;
  audio_url: string;
  text_url: string;
  timestamps: TimestampData[];
}

const LectureDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [alignmentData, setAlignmentData] = useState<AlignmentResponse | null>(null);
  const [currentAudioTime, setCurrentAudioTime] = useState<number>(0);
  const [alignmentLoading, setAlignmentLoading] = useState<boolean>(false);
  
  const url = searchParams.get("url") || "";
  const fileName = searchParams.get("fileName") || "";
  const type = searchParams.get("type") || "";
  const subject = searchParams.get("subject") || "";
  const topic = searchParams.get("topic") || "";

  const fetchTextContent = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if it's an RTF file
      if (url.toLowerCase().endsWith('.rtf')) {
        const apiUrl = `https://sscb-backend-api.onrender.com/rtf/extract/?file_url=${encodeURIComponent(url.trim())}&output_format=text`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setContent(data.content || "Failed to load RTF content");
      } else {
        const response = await fetch(url);
        const text = await response.text();
        setContent(text);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setContent("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const fetchAlignmentData = useCallback(async () => {
    if (!subject || !topic) return;
    
    try {
      setAlignmentLoading(true);
      const apiUrl = `https://sscb-backend-api.onrender.com/alignments/?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&language=hi`;
      console.log(`Fetching alignment data from: ${apiUrl}`);
      const response = await fetch(apiUrl);
      const data: AlignmentResponse = await response.json();
      console.log("Alignment data received:", data);
      setAlignmentData(data);
    } catch (error) {
      console.error("Error fetching alignment data:", error);
      setAlignmentData(null);
    } finally {
      setAlignmentLoading(false);
    }
  }, [subject, topic]);

  useEffect(() => {
    const isRtfFile = url.toLowerCase().endsWith('.rtf') || type.includes('rtf');
    if ((type.includes("text") || isRtfFile) && url) {
      fetchTextContent();
    } else {
      setLoading(false);
    }
  }, [url, type, fetchTextContent]);

  useEffect(() => {
    if (type.includes("audio")) {
      fetchAlignmentData();
    }
  }, [type, fetchAlignmentData]);

  // Fetch text content from alignment data for audio files
  useEffect(() => {
    const fetchTextFromAlignment = async () => {
      if (alignmentData && alignmentData.text_url && type.includes("audio")) {
        try {
          const apiUrl = `https://sscb-backend-api.onrender.com/rtf/extract/?file_url=${encodeURIComponent(alignmentData.text_url)}&output_format=text`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          console.log("Fetched text from alignment:", data);
          if(data){

            setContent(data.content || "Failed to load RTF content from alignment");
          }
        } catch (error) {
          console.error("Error fetching text from alignment:", error);
          setContent("Failed to load text content");
        }
      }
    };

    fetchTextFromAlignment();
  }, [alignmentData, type]);

  const handleBack = () => {
    navigate(`/lectures?subject=${encodeURIComponent(subject)}`);
  };

  const handleAudioTimeUpdate = useCallback((time: number) => {
    setCurrentAudioTime(time);
  }, []);

const highlightedContent = useMemo(() => {
  if (!alignmentData || !alignmentData.timestamps || !type.includes("audio")) {
    return content;
  }

  const currentWordIndex = alignmentData.timestamps.findIndex(
    (timestamp) =>
      currentAudioTime >= timestamp.start && currentAudioTime <= timestamp.end
  );

  // Build sequential text with highlighting
  return alignmentData.timestamps
    .map((t, index) => {
      const safeWord = t.word.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (index === currentWordIndex) {
        return `<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded font-semibold transition-all duration-200">${safeWord}</mark>`;
      }
      return safeWord;
    })
    .join(" ");
}, [alignmentData, currentAudioTime, type, content]);

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
              <div className="space-y-6">
                <AudioPlayer 
                  src={url} 
                  title={fileName} 
                  onTimeUpdate={handleAudioTimeUpdate}
                />
                {alignmentLoading && (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" />
                    <span className="ml-2 text-muted-foreground">Loading text sync...</span>
                  </div>
                )}
                {alignmentData && content && !alignmentLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Synchronized Text</span>
                      <span>Current time: {currentAudioTime.toFixed(1)}s</span>
                    </div>
                    <ScrollArea className="h-[400px] w-full rounded-lg border bg-card">
                      <div className="p-8">
                        <div className="prose prose-base dark:prose-invert max-w-none">
                          <div 
                            className="whitespace-pre-wrap font-sans text-base leading-loose tracking-wide"
                            dangerouslySetInnerHTML={{ __html: highlightedContent }}
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                )}
                {!alignmentData && !alignmentLoading && type.includes("audio") && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Text synchronization not available for this audio file.</p>
                  </div>
                )}
              </div>
            ) : (type.includes("text") || url.toLowerCase().endsWith('.rtf')) ? (
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
