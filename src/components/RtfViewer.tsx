import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RtfViewerProps {
  url: string;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RtfViewer = ({ url, fileName, isOpen, onClose }: RtfViewerProps) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && url) {
      fetchAndParseRtf();
    }
  }, [isOpen, url]);

  const fetchAndParseRtf = async () => {
    setLoading(true);
    try {
      console.log("Fetching RTF file from:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch RTF file");
      }

      const rtfText = await response.text();
      console.log("RTF content fetched, parsing...");
      
      // Basic RTF to HTML conversion
      const htmlContent = convertRtfToHtml(rtfText);
      setContent(htmlContent);
    } catch (error) {
      console.error("Error loading RTF file:", error);
      toast({
        title: "Error",
        description: "Failed to load notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const convertRtfToHtml = (rtf: string): string => {
    try {
      // Remove RTF control words and braces
      let text = rtf;
      
      // Remove RTF header
      text = text.replace(/\{\\rtf1[^\}]*\}/g, '');
      
      // Handle paragraphs
      text = text.replace(/\\par\s*/g, '<br><br>');
      text = text.replace(/\\line\s*/g, '<br>');
      
      // Handle bold
      text = text.replace(/\\b\s+([^\\]*?)\\b0/g, '<strong>$1</strong>');
      
      // Handle italic
      text = text.replace(/\\i\s+([^\\]*?)\\i0/g, '<em>$1</em>');
      
      // Handle underline
      text = text.replace(/\\ul\s+([^\\]*?)\\ulnone/g, '<u>$1</u>');
      
      // Handle font sizes (approximate conversion)
      text = text.replace(/\\fs(\d+)\s+/g, (match, size) => {
        const fontSize = Math.round(parseInt(size) / 2);
        return `<span style="font-size: ${fontSize}px;">`;
      });
      
      // Remove remaining RTF control words
      text = text.replace(/\\[a-z]+\d*\s*/gi, '');
      
      // Remove curly braces
      text = text.replace(/[\{\}]/g, '');
      
      // Handle bullet points
      text = text.replace(/·\s*/g, '• ');
      
      // Clean up multiple spaces and newlines
      text = text.replace(/\s+/g, ' ');
      text = text.replace(/\s*<br>\s*/g, '<br>');
      
      // Wrap in paragraphs
      const paragraphs = text.split('<br><br>')
        .filter(p => p.trim())
        .map(p => `<p class="mb-4">${p.trim()}</p>`)
        .join('');
      
      return paragraphs || '<p>No content available</p>';
    } catch (error) {
      console.error("Error parsing RTF:", error);
      return '<p>Error parsing document content</p>';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {fileName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
