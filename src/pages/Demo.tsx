import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";

const Demo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Platform Demo</h1>
          <p className="text-muted-foreground text-lg">
            Watch how SSC Mentor AI can help you prepare smarter for your exam
          </p>
        </div>

        {/* Video Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-6 w-6 text-primary" />
              Tutorial Video
            </CardTitle>
            <CardDescription>
              Learn how to use all the features of SSC Mentor AI platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <video
                controls
                className="absolute top-0 left-0 w-full h-full rounded-lg border shadow-lg"
                poster="/placeholder-video.jpg"
              >
                <source
                  src="https://rrmphoyhuavooptxtbxf.supabase.co/storage/v1/object/public/demo/EXAM%20PREP%20TUTORIAL(3).mov"
                  type="video/quicktime"
                />
                <source
                  src="https://rrmphoyhuavooptxtbxf.supabase.co/storage/v1/object/public/demo/EXAM%20PREP%20TUTORIAL(3).mov"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>

        {/* Features Covered */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <span className="font-semibold">Mock Tests:</span> How to attempt full-length mock tests with timer
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <span className="font-semibold">AI Analysis:</span> Understanding your performance report and AI-powered insights
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <span className="font-semibold">Lectures:</span> Accessing AI-generated notes and audio lectures
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <span className="font-semibold">Study Schedule:</span> Creating personalized study plans with AI
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <span className="font-semibold">Progress Tracking:</span> Monitoring your improvement over time
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to start your preparation journey?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate("/free-mock-test")}
              size="lg"
              variant="default"
            >
              Try Free Mock Test
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              size="lg"
              variant="outline"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
