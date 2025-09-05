import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopicChatProps {
  contentId: string;
  topicName: string;
}

export const TopicChat = ({ contentId, topicName }: TopicChatProps) => {
  const navigate = useNavigate();

  const openAIChat = () => {
    const params = new URLSearchParams({
      contentId,
      topicName: encodeURIComponent(topicName)
    });
    navigate(`/ai-chat?${params.toString()}`);
  };

  return (
    <Card className="p-6 border-0 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Ask AI about {topicName}</h3>
      </div>

      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">
          Get detailed explanations and answers about this topic from our AI assistant.
        </p>
        <Button 
          onClick={openAIChat}
          className="gap-2"
          size="lg"
        >
          <ExternalLink className="h-4 w-4" />
          Open AI Chat
        </Button>
      </div>
    </Card>
  );
};