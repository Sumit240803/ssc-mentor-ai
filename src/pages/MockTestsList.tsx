import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, FileText, Target } from "lucide-react";

interface MockTestInfo {
  fileName: string;
  testName: string;
  duration: number;
  totalQuestions: number;
}

const MockTestsList: React.FC = () => {
  const navigate = useNavigate();
  const [mockTests, setMockTests] = useState<MockTestInfo[]>([]);
  const [loading, setLoading] = useState(true);

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
                (total: number, section: any) => total + section.questions.length,
                0,
              );

              // Extract test number from filename for fallback
              const testNumberMatch = fileName.match(/(\d+)/);
              const testNumber = testNumberMatch ? testNumberMatch[1] : '';
              const fallbackName = testNumber ? `Mock Test ${testNumber}` : 'Mock Test';

              return {
                fileName,
                testName: data.testName || fallbackName,
                duration: data.duration || 90,
                totalQuestions,
              };
            } catch (error) {
              console.error(`Error loading ${fileName}:`, error);
              return null;
            }
          }),
        );

        setMockTests(testsData.filter(Boolean) as MockTestInfo[]);
      } catch (error) {
        console.error("Error loading mock tests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMockTests();
  }, []);

  const handleStartTest = (fileName: string) => {
    navigate(`/mock-test/${fileName.replace(".json", "")}`);
  };

  if (loading) {
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
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {test.testName}
                  </CardTitle>
                  <CardDescription>Full-length practice test</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">No negative marking</Badge>
                    <Badge variant="secondary">PYQ included</Badge>
                  </div>

                  <Button onClick={() => handleStartTest(test.fileName)} className="w-full" variant="default">
                    Start Test
                  </Button>
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
