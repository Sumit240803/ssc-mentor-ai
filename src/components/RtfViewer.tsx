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

      const text = await response.text();
      console.log("RTF content fetched, parsing...");
      
      const htmlContent = parseRtfToHtml(text);
      setContent(htmlContent);
      console.log("RTF parsed successfully");
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

  const parseRtfToHtml = (rtf: string): string => {
    try {
      let html = rtf;
      
      // Remove RTF header and metadata
      html = html.replace(/\{\\rtf1[^\{]*/, '');
      html = html.replace(/\{\\fonttbl[\s\S]*?\}\}/g, '');
      html = html.replace(/\{\\colortbl[\s\S]*?\}\}/g, '');
      html = html.replace(/\{\\stylesheet[\s\S]*?\}\}/g, '');
      html = html.replace(/\{\\info[\s\S]*?\}\}/g, '');
      html = html.replace(/\{\\maccreator[\s\S]*?\}/g, '');
      
      // Store formatting state
      let boldOpen = false;
      let italicOpen = false;
      let underlineOpen = false;
      
      // Handle paragraph breaks
      html = html.replace(/\\par\s*/g, '</p><p>');
      html = html.replace(/\\line\s*/g, '<br>');
      
      // Handle formatting
      html = html.replace(/\\b\s+/g, () => {
        boldOpen = true;
        return '<strong>';
      });
      html = html.replace(/\\b0\s*/g, () => {
        boldOpen = false;
        return '</strong>';
      });
      
      html = html.replace(/\\i\s+/g, () => {
        italicOpen = true;
        return '<em>';
      });
      html = html.replace(/\\i0\s*/g, () => {
        italicOpen = false;
        return '</em>';
      });
      
      html = html.replace(/\\ul\s+/g, () => {
        underlineOpen = true;
        return '<u>';
      });
      html = html.replace(/\\ulnone\s*/g, () => {
        underlineOpen = false;
        return '</u>';
      });
      
      // Remove font sizes and other formatting codes
      html = html.replace(/\\fs\d+\s*/g, '');
      html = html.replace(/\\f\d+\s*/g, '');
      html = html.replace(/\\cf\d+\s*/g, '');
      html = html.replace(/\\highlight\d+\s*/g, '');
      
      // Handle special characters
      html = html.replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
      
      // Remove all remaining control words
      html = html.replace(/\\[a-z]+(-?\d+)?[ ]?/gi, '');
      html = html.replace(/\\[^a-z\s]/gi, '');
      
      // Remove curly braces
      html = html.replace(/[{}]/g, '');
      
      // Clean up whitespace
      html = html.replace(/\s+/g, ' ');
      html = html.replace(/\s*<p>\s*/g, '<p>');
      html = html.replace(/\s*<\/p>\s*/g, '</p>');
      
      // Wrap in paragraphs
      html = `<p>${html}</p>`;
      
      // Clean up empty paragraphs
      html = html.replace(/<p>\s*<\/p>/g, '');
      
      // Add spacing to paragraphs
      html = html.replace(/<p>/g, '<p class="mb-4">');
      
      return html.trim() || '<p>No content available</p>';
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
              className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
