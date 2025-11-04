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
      
      // Dynamic import of rtf-parser
      const { parseRtfString } = await import('rtf-parser');
      
      const parsed = await parseRtfString(rtfText);
      console.log("Parsed RTF:", parsed);
      
      // Convert parsed RTF to HTML
      const htmlContent = convertParsedRtfToHtml(parsed);
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

  const convertParsedRtfToHtml = (doc: any): string => {
    try {
      if (!doc || !doc.content) {
        return '<p>No content available</p>';
      }

      const processContent = (content: any[]): string => {
        return content.map(item => {
          if (typeof item === 'string') {
            // Handle plain text
            return item.replace(/\n/g, '<br>');
          } else if (item.type === 'paragraph') {
            // Handle paragraphs
            const paraContent = item.content ? processContent(item.content) : '';
            return `<p class="mb-4">${paraContent}</p>`;
          } else if (item.type === 'span') {
            // Handle styled spans
            let text = item.value || '';
            
            if (item.style) {
              if (item.style.bold) {
                text = `<strong>${text}</strong>`;
              }
              if (item.style.italic) {
                text = `<em>${text}</em>`;
              }
              if (item.style.underline) {
                text = `<u>${text}</u>`;
              }
              if (item.style.fontSize) {
                text = `<span style="font-size: ${item.style.fontSize}pt">${text}</span>`;
              }
            }
            
            return text;
          } else if (item.content) {
            // Handle nested content
            return processContent(item.content);
          }
          
          return '';
        }).join('');
      };

      const html = processContent(doc.content);
      return html || '<p>No content available</p>';
    } catch (error) {
      console.error("Error converting RTF to HTML:", error);
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
              className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
