import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, FileText, Target, BarChart3, RefreshCw } from "lucide-react";
import { useMockTestResults } from "@/hooks/useMockTestResults";

interface MockTestInfo {
  fileName: string;
  testName: string;
  duration: number;
  totalQuestions: number;
  comingSoon?: boolean;
  hasAttempted?: boolean;
  lastAttemptScore?: number;
  lastAttemptPercentage?: number;
}

const MockTestsList: React.FC = () => {
  const navigate = useNavigate();
  const [mockTests, setMockTests] = useState<MockTestInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { userResults, loading: resultsLoading, hasAttemptedTest, getLastAttempt } = useMockTestResults();

  useEffect(() => {
    const loadMockTests = async () => {
      try {
        // List of mock test files
        const testFiles = [
          "Complete_mock-test_1.json",
          "Complete_mock-test_2.json",
          "Complete_mock-test_3.json",
          "Complete_mock-test_4.json",
          "Complete_mock-test_5.json",
          "Complete_mock-test_6.json",
          "Complete_mock-test_7.json",
          "Complete_mock-test_8.json",
          "Complete_mock-test_9.json",
          "Complete_mock-test_10.json",
          "Complete_mock-test_11.json",
          "Complete_mock-test_12.json",
          "Complete_mock-test_13.json",
          "Complete_mock-test_14.json",
          "Complete_mock-test_15.json",
          "Complete_mock-test_16.json",
          "Complete_mock-test_17.json",
          "Complete_mock-test_18.json",
          "Complete_mock-test_19.json",
          "Complete_mock-test_20.json",
          "Complete_mock-test_21.json",
          "Complete_mock-test_22.json",
          "Complete_mock-test_23.json",
          "Complete_mock-test_24.json",
          "Complete_mock-test_25.json",
        ];

        const testsData = await Promise.all(
          testFiles.map(async (fileName) => {
            try {
              const response = await fetch(`/${encodeURIComponent(fileName)}`);
              const data = await response.json();
              console.log(data);
              console.log(data.testName);

              // Calculate total questions
              const totalQuestions = data.mockTest.reduce(
                (total: number, section: { questions: unknown[] }) => total + section.questions.length,
                0,
              );

              // Extract test number from filename for fallback
              const testNumberMatch = fileName.match(/(\d+)/);
              const testNumber = testNumberMatch ? testNumberMatch[1] : "";
              const fallbackName = testNumber ? `Mock Test ${testNumber}` : "Mock Test";
              const testName = data.testName || fallbackName;

              // Check if user has attempted this test using API data
              const lastAttempt = getLastAttempt(testName);
              const hasAttempted = hasAttemptedTest(testName);

              return {
                fileName,
                testName,
                duration: data.duration || 90,
                totalQuestions,
                comingSoon: false,
                hasAttempted,
                lastAttemptScore: lastAttempt?.correct_answers,
                lastAttemptPercentage: lastAttempt?.percentage,
              };
            } catch (error) {
              console.error(`Error loading ${fileName}:`, error);
              return null;
            }
          }),
        );

        const loadedTests = testsData.filter(Boolean) as MockTestInfo[];
        
        // Add coming soon tests
        const comingSoonTests: MockTestInfo[] = [
          { fileName: "Complete_mock-test_26.json", testName: "Mock Test 26", duration: 90, totalQuestions: 0, comingSoon: true, hasAttempted: false },
          { fileName: "Complete_mock-test_27.json", testName: "Mock Test 27", duration: 90, totalQuestions: 0, comingSoon: true, hasAttempted: false },
          { fileName: "Complete_mock-test_28.json", testName: "Mock Test 28", duration: 90, totalQuestions: 0, comingSoon: true, hasAttempted: false },
          { fileName: "Complete_mock-test_29.json", testName: "Mock Test 29", duration: 90, totalQuestions: 0, comingSoon: true, hasAttempted: false },
          { fileName: "Complete_mock-test_30.json", testName: "Mock Test 30", duration: 90, totalQuestions: 0, comingSoon: true, hasAttempted: false },
        ];

        setMockTests([...loadedTests, ...comingSoonTests]);
      } catch (error) {
        console.error("Error loading mock tests:", error);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user results to load before loading tests
    if (!resultsLoading) {
      loadMockTests();
    }
  }, [resultsLoading, userResults, hasAttemptedTest, getLastAttempt]);

  const handleStartTest = (fileName: string) => {
    navigate(`/mock-test/${fileName.replace(".json", "")}`);
  };

  const handleViewAnalysis = (testName: string) => {
    // Navigate to analysis page
    navigate(`/mock-test-analysis/${encodeURIComponent(testName)}`);
  };

  if (loading || resultsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading mock tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Target className="h-10 w-10 text-primary" />
            Mock Tests
          </h1>
          <p className="text-muted-foreground text-lg">
            Practice with full-length mock tests to improve your preparation
          </p>
        </div>

        {mockTests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Mock Tests Available</h3>
              <p className="text-muted-foreground">Mock tests will appear here once they are uploaded.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <Card
                key={test.fileName}
                className="bg-gradient-card border-primary/20 hover:shadow-elevated transition-all duration-300 hover:border-primary/40"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {test.testName}
                    </div>
                    <div className="flex items-center gap-2">
                      {test.hasAttempted && (
                        <Badge variant="default" className="bg-green-600">
                          Attempted
                        </Badge>
                      )}
                      {test.comingSoon && (
                        <Badge variant="secondary">Coming Soon</Badge>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {test.comingSoon ? "This test will be available soon" : test.hasAttempted ? "Review your performance or take it again" : "Full-length practice test"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!test.comingSoon && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{test.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>{test.totalQuestions} questions</span>
                        </div>
                      </div>

                      {/* Show last attempt info if available */}
                      {test.hasAttempted && test.lastAttemptPercentage !== undefined && (
                        <div className="p-3 bg-muted rounded-lg border">
                          <div className="text-xs text-muted-foreground mb-1">Last Attempt</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Score: {test.lastAttemptScore}/{test.totalQuestions}</span>
                            <Badge variant={test.lastAttemptPercentage >= 60 ? "default" : "destructive"}>
                              {test.lastAttemptPercentage}%
                            </Badge>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-2">
                    {test.hasAttempted && !test.comingSoon && (
                      <Button 
                        onClick={() => handleViewAnalysis(test.testName)} 
                        className="flex-1" 
                        variant="outline"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analysis
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleStartTest(test.fileName)} 
                      className={test.hasAttempted && !test.comingSoon ? "flex-1" : "w-full"}
                      variant="default"
                      disabled={test.comingSoon}
                    >
                      {test.comingSoon ? (
                        "Coming Soon"
                      ) : test.hasAttempted ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reattempt
                        </>
                      ) : (
                        "Start Test"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTestsList;
