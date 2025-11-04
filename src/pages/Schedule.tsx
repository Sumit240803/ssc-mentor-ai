import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/AudioPlayer";

interface ScheduleDetails {
  schedule: string;
  audio_url: string;
  text_url: string;
  text_content?: string;
}

const Schedule = () => {
  const [schedules, setSchedules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://sscb-backend-api.onrender.com/schedules/');
      const data = await response.json();
      
      setSchedules(data.schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const parseRTF = (rtfContent: string): string => {
    try {
      // Remove RTF control words and formatting
      let text = rtfContent
        // Remove RTF header
        .replace(/^\{\\rtf1[^}]*\}/g, '')
        // Remove control words (e.g., \par, \pard, \b, etc.)
        .replace(/\\[a-z]{1,32}(-?\d{1,10})?[ ]?/gi, ' ')
        // Remove control symbols
        .replace(/\\'[0-9a-f]{2}/gi, ' ')
        // Remove group brackets
        .replace(/[{}]/g, '')
        // Replace multiple spaces with single space
        .replace(/\s+/g, ' ')
        // Trim whitespace
        .trim();
      
      return text || rtfContent;
    } catch (error) {
      console.error('Error parsing RTF:', error);
      return rtfContent;
    }
  };

  const handleScheduleSelect = async (schedule: string) => {
    try {
      setSelectedSchedule(schedule);
      setLoadingDetails(true);
      
      const response = await fetch(`https://sscb-backend-api.onrender.com/schedules/${schedule}`);
      const data = await response.json();
      
      // Fetch text content
      if (data.text_url) {
        try {
          const textResponse = await fetch(data.text_url);
          const rtfContent = await textResponse.text();
          
          // Parse RTF to plain text
          const parsedText = parseRTF(rtfContent);
          data.text_content = parsedText;
        } catch (error) {
          console.error('Error fetching text content:', error);
        }
      }
      
      setScheduleDetails(data);
    } catch (error) {
      console.error('Error fetching schedule details:', error);
      toast.error('Failed to load schedule details');
    } finally {
      setLoadingDetails(false);
    }
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
            Study Schedule
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your preferred study schedule
          </p>
        </div>

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {schedules.map((schedule) => (
            <Card
              key={schedule}
              onClick={() => handleScheduleSelect(schedule)}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedSchedule === schedule
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-accent/5'
              }`}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {schedule}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Schedule Details */}
        {loadingDetails && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {!loadingDetails && scheduleDetails && (
          <div className="space-y-6">
            {/* Audio Player */}
            {scheduleDetails.audio_url && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Audio Schedule
                </h3>
                <AudioPlayer 
                  src={scheduleDetails.audio_url}
                  title={selectedSchedule || undefined}
                />
              </div>
            )}

            {/* Text Content */}
            {scheduleDetails.text_content && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Schedule Details
                </h3>
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-line text-foreground leading-relaxed">
                  {scheduleDetails.text_content}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;