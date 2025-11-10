import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FreeGlobalTest = () => {
  const navigate = useNavigate();

  // Mock test data - in real scenario, this would come from an API
  const mockTests = [
    {
      id: "Complete_mock-test_1",
      testName: "SSC Delhi Police Complete Mock Test 1",
      duration: 90,
      totalQuestions: 100,
      sections: [
       { name: "General Knowledge", questions: 50 },
        { name: "Reasoning", questions: 25 },
        { name: "Numerical Aptitude", questions: 15 },
        { name: "Computer", questions: 10 },
      ],
      isFree: true,

    },
    {
      id: "Complete_mock-test_2",
      testName: "SSC Delhi Police Complete Mock Test 2",
      duration: 90,
      totalQuestions: 100,
      sections: [
       { name: "General Knowledge", questions: 50 },
        { name: "Reasoning", questions: 25 },
        { name: "Numerical Aptitude", questions: 15 },
        { name: "Computer", questions: 10 },
      ],
      isFree: false,
    
    },
    {
      id: "Complete_mock-test_3",
      testName: "SSC Delhi Police Complete Mock Test 3",
      duration: 90,
      totalQuestions: 100,
      sections: [
        { name: "General Knowledge", questions: 50 },
        { name: "Reasoning", questions: 25 },
        { name: "Numerical Aptitude", questions: 15 },
        { name: "Computer", questions: 10 },
      ],
      isFree: false,
   
    },
    {
      id: "Complete_mock-test_4",
      testName: "SSC Delhi Police Complete Mock Test 4",
      duration: 90,
      totalQuestions: 100,
      sections: [
        { name: "General Knowledge", questions: 50 },
        { name: "Reasoning", questions: 25 },
        { name: "Numerical Aptitude", questions: 15 },
        { name: "Computer", questions: 10 },
      ],
      isFree: false,
    
    },
  ];

  const handleStartTest = (testId: string, isFree: boolean) => {
    if (isFree) {
      navigate(`/mock-test/${testId}`);
    } else {
      // Redirect to pricing page for locked tests
      navigate("/pricing");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Award className="h-10 w-10 text-primary" />
            Free Mock Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Try our first complete mock test for free! Sign up to get access to full-length practice test and experience our platform.
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-primary/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Start Your Preparation Journey</h3>
                <p className="text-muted-foreground mb-4">
                  Our first mock test is completely free! Sign up to experience the full exam pattern, get instant results, 
                  AI-powered analysis, and detailed solutions. Upgrade to unlock all 25+ mock tests.
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Full-length test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Instant results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>AI Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mock Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <Card
              key={test.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                test.isFree
                  ? "border-primary/50 hover:shadow-lg hover:-translate-y-1"
                  : "opacity-75 hover:opacity-90"
              )}
            >
              {/* Free Badge */}
              {test.isFree && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-green-600 hover:bg-green-700">FREE</Badge>
                </div>
              )}

              {/* Lock Overlay for Paid Tests */}
              {!test.isFree && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-semibold mb-2">Locked Test</p>
                    <Button
                      size="sm"
                      onClick={() => handleStartTest(test.id, false)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Upgrade to Unlock
                    </Button>
                  </div>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">
                    Mock Test {index + 1}
                  </CardTitle>
                
                </div>
                <CardDescription className="text-base">{test.testName}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Test Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{test.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{test.totalQuestions} questions</span>
                    </div>
                  </div>

                  {/* Sections */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Test Sections:</h4>
                    <div className="space-y-1">
                      {test.sections.map((section, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                          <span>• {section.name}</span>
                          <span>{section.questions} Qs</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {test.isFree && (
                    <Button
                      className="w-full"
                      onClick={() => handleStartTest(test.id, true)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Free Test
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-br from-primary/10 via-purple-50/50 to-primary/10 dark:from-primary/20 dark:via-purple-950/30 dark:to-primary/20 border-primary/20">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Want Access to All Mock Tests?</h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              Unlock 25+ complete mock tests, detailed solutions, AI-powered analysis, 
              personalized study schedules, and much more with our premium plans.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate("/pricing")}>
                View Pricing Plans
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Sign Up for Free
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreeGlobalTest;
