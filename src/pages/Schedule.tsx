import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Clock, BookCheck } from "lucide-react";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/AudioPlayer";
import { StudyPlanProgress } from "@/components/StudyPlanProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const handleScheduleSelect = async (schedule: string) => {
    try {
      setSelectedSchedule(schedule);
      setLoadingDetails(true);
      
      const response = await fetch(`https://sscb-backend-api.onrender.com/schedules/${schedule}`);
      const data = await response.json();
      
      // Fetch text content using RTF extraction endpoint
      if (data.text_url) {
        try {
          const apiUrl = `https://sscb-backend-api.onrender.com/rtf/extract/?file_url=${encodeURIComponent(data.text_url)}&output_format=text`;
          const textResponse = await fetch(apiUrl);
          const extractedData = await textResponse.json();
          
          data.text_content = extractedData.content || "Failed to load RTF content";
        } catch (error) {
          console.error('Error fetching text content:', error);
          data.text_content = "Failed to load text content";
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
            Track your 45-day study plan and access time-based schedules
          </p>
        </div>

        {/* Tabs for Study Plan and Time Schedules */}
        <Tabs defaultValue="study-plan" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="study-plan" className="flex items-center gap-2">
              <BookCheck className="h-4 w-4" />
              Study Plan
            </TabsTrigger>
            <TabsTrigger value="time-schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Schedule
            </TabsTrigger>
          </TabsList>

          {/* Study Plan Tab */}
          <TabsContent value="study-plan">
            <StudyPlanProgress />
          </TabsContent>

          {/* Time Schedule Tab */}
          <TabsContent value="time-schedule">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Schedule;