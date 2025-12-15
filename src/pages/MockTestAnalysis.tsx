import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMockTestResults, MockTestResult } from "@/hooks/useMockTestResults";
import { 
  ArrowLeft, 
  Award, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Target,
  Calendar,
  Brain,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";


interface Question {
  id: string;
  "question-hindi": string;
  "question-english": string;
  "options-hindi": string[];
  "options-english": string[];
  "answer-hindi": string;
  "answer-english": string;
  "question-image"?: string;
}

interface Section {
  section: string;
  questions: Question[];
}

const MockTestAnalysis: React.FC = () => {
  const { testName } = useParams<{ testName: string }>();
  const navigate = useNavigate();
  const { getTestAttempts, loading } = useMockTestResults();
  const [attempts, setAttempts] = useState<MockTestResult[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<MockTestResult | null>(null);
  const [motivation, setMotivation] = useState<{ message: string } | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<Question[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  useEffect(() => {
    if (testName) {
      const decodedTestName = decodeURIComponent(testName);
      const testAttempts = getTestAttempts(decodedTestName);
      setAttempts(testAttempts);
      if (testAttempts.length > 0) {
        setSelectedAttempt(testAttempts[0]); // Select most recent attempt
      }
    }
  }, [testName, getTestAttempts]);

  // Fetch motivation and analysis when attempt is selected
  useEffect(() => {
    const fetchMotivationAndAnalysis = async () => {
      if (!selectedAttempt) return;
      
      // Only fetch if we don't have data already
      if (motivation && analysis) return;

      try {
        // First, fetch motivation
        if (!motivation && !isLoadingMotivation) {
          setIsLoadingMotivation(true);
          const motivationResult = await getMotivation(selectedAttempt.percentage);
          setMotivation(motivationResult);
          setIsLoadingMotivation(false);
        }

        // Then, fetch analysis
        if (!analysis && !isLoadingAnalysis) {
          setIsLoadingAnalysis(true);
          const analysisResult = await getAnalysis(selectedAttempt);
          setAnalysis(analysisResult || null);
          setIsLoadingAnalysis(false);
        }
      } catch (error) {
        console.error("Error in fetchMotivationAndAnalysis:", error);
        setIsLoadingMotivation(false);
        setIsLoadingAnalysis(false);
      }
    };

    fetchMotivationAndAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttempt]);

  // API call functions (similar to MockTest.tsx)
  const getMotivation = async (percentage: number): Promise<{ message: string } | null> => {
    try {
      const response = await fetch('https://sscb-backend-api.onrender.com/chat/motivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({motivation_score : percentage }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get motivation: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting motivation:', error);
      return null;
    }
  };
const getAnalysis = async (attempt: MockTestResult): Promise<string| null> => {
  if (!attempt || !testName) {
    console.error("No attempt or test name available for analysis");
    return null;
  }

  try {
    // Check localStorage cache first
    const cacheKey = `mocktestanalysis-${testName}-${attempt.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log("Returning cached analysis from:", cacheKey);
      return JSON.parse(cached);
    }
    
    console.log("Fetching new analysis from API for:", cacheKey);
    const payload = {
      total_questions: attempt.total_questions,
      correct_answers: attempt.correct_answers,
      wrong_answers: attempt.incorrect_answers,
      skipped_questions: attempt.unanswered_questions,
      subject_wise_score: attempt.section_wise_scores,
      time_taken_minutes: Math.round(attempt.time_taken_seconds / 60),
    };

    console.log("Analysis payload:", payload);

    const response = await fetch("https://sscb-backend-api.onrender.com/mocktest/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`Failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Analysis response:", data);
    const analysisText = data.analysis || data.message;

    if (!analysisText) {
      console.error("No analysis text in response");
      return null;
    }

    // Cache the analysis
    localStorage.setItem(cacheKey, JSON.stringify(analysisText));
    console.log("Analysis cached successfully to:", cacheKey);
    
    return analysisText;
  } catch (err) {
    console.error("Error getting analysis:", err);
    return null;
  }
};

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceLabel = (percentage: number): string => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  // Convert test name back to filename format
  // E.g., "MOCK TEST 1" -> "Complete_mock-test_1"
  const getTestFileName = (testName: string): string => {
    const match = testName.match(/MOCK TEST (\d+)/i);
    if (match) {
      return `Complete_mock-test_${match[1]}`;
    }
    // Fallback: convert the test name to filename format
    return testName.toLowerCase().replace(/\s+/g, '-');
  };

  const loadReviewQuestions = async () => {
    if (!selectedAttempt) return;
    
    setIsLoadingReview(true);
    try {
      const fileName = getTestFileName(selectedAttempt.test_name);
      const response = await fetch(`/${fileName}.json`);
      if (!response.ok) throw new Error('Failed to load test');
      
      const data: { mockTest: Section[] } = await response.json();
      const allQuestions: Question[] = [];
      data.mockTest.forEach((section) => {
        allQuestions.push(...section.questions);
      });
      
      setReviewQuestions(allQuestions);
      setCurrentReviewIndex(0);
      setShowReview(true);
    } catch (error) {
      console.error('Error loading review:', error);
    } finally {
      setIsLoadingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!selectedAttempt) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/mock-tests")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mock Tests
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Attempts Found</h3>
              <p className="text-muted-foreground mb-4">You haven't attempted this test yet.</p>
              <Button onClick={() => navigate("/mock-tests")}>
                Go to Mock Tests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/mock-tests")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mock Tests
          </Button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Test Analysis
          </h1>
          <p className="text-muted-foreground">{selectedAttempt.test_name}</p>
        </div>

        {/* Attempt Selector */}
        {attempts.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Attempt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {attempts.map((attempt, index) => (
                  <Button
                    key={attempt.id}
                    variant={selectedAttempt.id === attempt.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedAttempt(attempt);
                      // Clear previous motivation and analysis when switching attempts
                      setMotivation(null);
                      setAnalysis(null);
                    }}
                  >
                    Attempt {attempts.length - index}
                    <Badge variant="secondary" className="ml-2">
                      {attempt.percentage}%
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Performance */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Overall Performance
            </CardTitle>
            <CardDescription>
              Attempted on {formatDate(selectedAttempt.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{selectedAttempt.total_questions}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{selectedAttempt.correct_answers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{selectedAttempt.incorrect_answers}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{formatTime(selectedAttempt.time_taken_seconds)}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Score</span>
                  <span className={cn("text-2xl font-bold", getPerformanceColor(selectedAttempt.percentage))}>
                    {selectedAttempt.score}/{selectedAttempt.total_questions}
                  </span>
                </div>
                <Progress value={selectedAttempt.percentage} className="h-3" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn("h-5 w-5", getPerformanceColor(selectedAttempt.percentage))} />
                  <span className="font-medium">Performance</span>
                </div>
                <Badge 
                  variant={selectedAttempt.percentage >= 60 ? "default" : "destructive"}
                  className="text-lg px-4 py-1"
                >
                  {selectedAttempt.percentage}% - {getPerformanceLabel(selectedAttempt.percentage)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section-wise Performance */}
        {selectedAttempt.section_wise_scores && Object.keys(selectedAttempt.section_wise_scores).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Section-wise Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead className="text-center">Total Questions</TableHead>
                    <TableHead className="text-center">Correct Answers</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(selectedAttempt.section_wise_scores).map(([section, scores]) => (
                    <TableRow key={section}>
                      <TableCell className="font-medium">{section}</TableCell>
                      <TableCell className="text-center">{scores.total}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-green-600 font-semibold">{scores.correct}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={scores.percentage >= 60 ? "default" : "secondary"}
                          className={cn(
                            scores.percentage >= 60 ? "bg-green-600" : "bg-yellow-600"
                          )}
                        >
                          {scores.percentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full">
                          <Progress value={scores.percentage} className="h-2" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Motivation Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Motivation
            </CardTitle>
            <CardDescription>A message to keep you motivated</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMotivation ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-muted-foreground">Getting your motivation message...</p>
              </div>
            ) : motivation ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-line leading-relaxed">{motivation.message}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Unable to load motivation message. Please try again later.
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Analysis Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              AI Analysis
            </CardTitle>
            <CardDescription>Personalized insights about your performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnalysis ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-muted-foreground">Analyzing your performance...</p>
              </div>
            ) : analysis ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Unable to load analysis. Please try again later.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            size="lg"
            onClick={loadReviewQuestions}
            disabled={isLoadingReview}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {isLoadingReview ? "Loading..." : "Review Mock Test"}
          </Button>
          <Button 
            size="lg"
            onClick={() => navigate(`/mock-test/${getTestFileName(selectedAttempt.test_name)}`)}
          >
            Reattempt Test
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate("/mock-tests")}
          >
            All Mock Tests
          </Button>
        </div>

        {/* Review Dialog */}
        <Dialog open={showReview} onOpenChange={setShowReview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Review Mock Test - Question {currentReviewIndex + 1} of {reviewQuestions.length}
              </DialogTitle>
            </DialogHeader>
            
            {reviewQuestions.length > 0 && (
              <div className="space-y-6">
                {(() => {
                  const currentQuestion = reviewQuestions[currentReviewIndex];
                  const questionText = currentQuestion["question-hindi"];
                  const options = currentQuestion["options-hindi"];
                  const correctAnswer = currentQuestion["answer-hindi"];
                  const hasQuestionImage = currentQuestion["question-image"];
                  const isQuestionTextUrl = questionText.startsWith("http://") || questionText.startsWith("https://");

                  return (
                    <>
                      {/* Question */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Question {currentReviewIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {hasQuestionImage && (
                            <div className="mb-4">
                              <img 
                                src={currentQuestion["question-image"]} 
                                alt="Question" 
                                className="max-w-full h-auto rounded-lg border"
                              />
                            </div>
                          )}
                          
                          <div className="mb-6">
                            {hasQuestionImage ? (
                              <p className="text-base leading-relaxed">{questionText}</p>
                            ) : isQuestionTextUrl ? (
                              <img 
                                src={questionText} 
                                alt="Question" 
                                className="max-w-full h-auto rounded-lg border"
                              />
                            ) : (
                              <p style={{ whiteSpace: 'pre-line' }} className="text-base leading-relaxed">{questionText}</p>
                            )}
                          </div>

                          <RadioGroup value={correctAnswer} disabled>
                            {options.map((option, index) => {
                              const isCorrectOption = option === correctAnswer;

                              return (
                                <div
                                  key={index}
                                  className={cn(
                                    "p-4 rounded-lg border-2 transition-colors",
                                    isCorrectOption && "border-green-500 bg-green-50 dark:bg-green-950",
                                    !isCorrectOption && "border-border"
                                  )}
                                >
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem
                                      value={option}
                                      id={`option-${index}`}
                                      className="mt-1"
                                    />
                                    <Label
                                      htmlFor={`option-${index}`}
                                      className="flex-1 cursor-pointer text-base leading-relaxed"
                                    >
                                      {option}
                                    </Label>
                                    {isCorrectOption && (
                                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </RadioGroup>

                          {/* Correct Answer Indicator */}
                          <div className="mt-4 p-4 rounded-lg bg-muted">
                            <p className="text-sm text-green-600">
                              <CheckCircle className="h-4 w-4 inline mr-2" />
                              Correct Answer: {correctAnswer}
                            </p>
                          </div>

                          {/* Solution */}
                          {(currentQuestion["solution-hindi"] || currentQuestion["solution-img"]) && (
                            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Solution:</h4>
                              {currentQuestion["solution-hindi"] && (
                                <p style={{ whiteSpace: 'pre-line' }} className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                  {currentQuestion["solution-hindi"]}
                                </p>
                              )}
                              {currentQuestion["solution-img"] && (
                                <img 
                                  src={currentQuestion["solution-img"]} 
                                  alt="Solution" 
                                  className="mt-3 max-w-full rounded-lg border border-blue-200 dark:border-blue-700"
                                />
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Navigation */}
                      <div className="flex justify-between items-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))}
                          disabled={currentReviewIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        
                        <span className="text-sm text-muted-foreground">
                          {currentReviewIndex + 1} / {reviewQuestions.length}
                        </span>

                        <Button
                          variant="outline"
                          onClick={() => setCurrentReviewIndex(Math.min(reviewQuestions.length - 1, currentReviewIndex + 1))}
                          disabled={currentReviewIndex === reviewQuestions.length - 1}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MockTestAnalysis;
