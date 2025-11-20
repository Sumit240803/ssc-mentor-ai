import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useMockTest, MockTestAnalysis, Language } from "@/hooks/useMockTest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Award,
  Timer,
  BookOpen,
  Target,
  Brain,
  Languages,
  Flag,
  ZoomIn,
  ZoomOut,
  Pause,
  Play,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const MockTest: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [motivation, setMotivation] = useState<{ message: string } | null>(null);
  const [analysis, setAnalysis] = useState<MockTestAnalysis | null>(null);
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("hindi");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [showRestoredNotification, setShowRestoredNotification] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const {
    mockTestData,
    testState,
    startTest,
    submitTest,
    pauseTest,
    resumeTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    getResults,
    calculateSectionWiseScores,
    resetTest,
    enterReviewMode,
    switchLanguage,
    formatTime,
    getMotivation,
    getAnalysis,
    isDataLoaded,
    previousResults,
    loadingPreviousResults,
  } = useMockTest(testId);

  // Show notification when progress is restored
  useEffect(() => {
    if (testState.isActive && testState.startTime && testState.userAnswers && Object.keys(testState.userAnswers).length > 0) {
      // Check if this is a restored session (has answers but just loaded)
      const hasRestoredData = Object.keys(testState.userAnswers).length > 0;
      if (hasRestoredData && !showRestoredNotification) {
        setShowRestoredNotification(true);
        toast.success("Progress Restored", {
          description: `Your previous answers and ${formatTime(testState.timeRemaining)} remaining time have been recovered.`,
          duration: 5000,
        });
      }
    }
  }, [testState.isActive]);

  // Fetch motivation and analysis when test is completed
  useEffect(() => {
    const fetchMotivationAndAnalysis = async () => {
      if (testState.isCompleted && !motivation && !isLoadingMotivation && !isLoadingAnalysis) {
        const results = getResults();

        // First, fetch motivation
        setIsLoadingMotivation(true);
        const motivationResult = await getMotivation(results.percentage);
        setMotivation(motivationResult);
        setIsLoadingMotivation(false);

        // Then, fetch analysis
        setIsLoadingAnalysis(true);
        const analysisResult = await getAnalysis();
        setAnalysis(analysisResult);
        setIsLoadingAnalysis(false);
      }
    };

    fetchMotivationAndAnalysis();
  }, [testState.isCompleted]);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading mock test data...</p>
        </div>
      </div>
    );
  }

  // Start Test Screen
  if (!testState.isActive && !testState.isCompleted && testState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              {mockTestData?.testName || "Mock Test"}
            </CardTitle>
            <CardDescription className="text-lg">Full-length practice test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Test Pattern
                </h3>
                <ul className="text-sm space-y-1">
                  {mockTestData?.mockTest.map((section) => (
                    <li key={section.section}>
                      • {section.section}: {section.questions.length} questions
                    </li>
                  ))}
                  <li className="font-semibold pt-1">
                    Total: {mockTestData?.mockTest.reduce((total, section) => total + section.questions.length, 0)}{" "}
                    questions
                  </li>
                </ul>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Time & Rules
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• Duration: {mockTestData?.duration || 90} minutes</li>
                  <li>• Can review and change answers</li>
                  <li>• Can pause and resume test</li>
                  <li>• Auto-submit when time ends</li>
                </ul>
              </div>
            </div>

            {/* Previous Results Section */}
            {loadingPreviousResults ? (
              <div className="bg-muted p-6 rounded-lg text-center">
                <LoadingSpinner className="mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading previous results...</p>
              </div>
            ) : previousResults.length > 0 ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Previous Attempts ({previousResults.length})
                </h3>
                <div className="space-y-3">
                  {previousResults.slice(0, 3).map((result, index) => (
                    <div key={result.id} className="bg-background p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Attempt {previousResults.length - index}</span>
                        <Badge
                          variant={
                            result.percentage >= 75 ? "default" : result.percentage >= 50 ? "secondary" : "destructive"
                          }
                        >
                          {result.percentage}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Score:</span> {result.score}/{result.total_questions}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Correct:</span> {result.correct_answers}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span> {formatTime(result.time_taken_seconds)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(result.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                {previousResults.length > 3 && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    and {previousResults.length - 3} more attempt(s)
                  </p>
                )}
              </div>
            ) : null}

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ul className="text-sm space-y-1">
                <li>1. Read each question carefully before selecting an answer</li>
                <li>2. Use the navigation panel to move between questions</li>
                <li>3. Questions marked with "PYQ" are from previous year papers</li>
                <li>4. Make sure to submit the test before time runs out</li>
                <li>5. You can review your answers before final submission</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Select Language:</h3>
              <ToggleGroup
                type="single"
                value={selectedLanguage}
                onValueChange={(value) => value && setSelectedLanguage(value as Language)}
                className="justify-start"
              >
                <ToggleGroupItem value="hindi" aria-label="Hindi" className="flex-1">
                  हिंदी (Hindi)
                </ToggleGroupItem>
                <ToggleGroupItem value="english" aria-label="English" className="flex-1">
                  English
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Button onClick={() => startTest(selectedLanguage)} size="lg" className="w-full" variant="default">
              {previousResults.length > 0 ? "Retake Test" : "Start Test"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Screen (after submission)
  if (testState.isCompleted && !testState.isReviewMode) {
    const results = getResults();

    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Award className="h-8 w-8 text-primary" />
                Test Results
              </CardTitle>
              <CardDescription>Your performance summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-card rounded-lg border">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {results.score}/{results.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                <div className="text-center p-6 bg-card rounded-lg border">
                  <div className="text-3xl font-bold text-primary mb-2">{results.percentage}%</div>
                  <div className="text-sm text-muted-foreground">Percentage</div>
                </div>
                <div className="text-center p-6 bg-card rounded-lg border">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatTime(results.totalTimeIncludingPauses || results.timeTaken)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Time Taken</div>
                  {results.totalPausedTime > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      (Paused: {formatTime(results.totalPausedTime)})
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-700 dark:text-green-300">{results.correctAnswers}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="font-semibold text-red-700 dark:text-red-300">{results.incorrectAnswers}</div>
                  <div className="text-xs text-red-600 dark:text-red-400">Incorrect</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="font-semibold text-yellow-700 dark:text-yellow-300">
                    {results.unansweredQuestions}
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">Unanswered</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-700 dark:text-blue-300">{results.answeredQuestions}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Attempted</div>
                </div>
              </div>

              {/* Section-wise Performance Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Section-wise Performance</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Section</TableHead>
                        <TableHead className="text-center font-semibold">Total Questions</TableHead>
                        <TableHead className="text-center font-semibold">Correct</TableHead>
                        <TableHead className="text-center font-semibold">Incorrect</TableHead>
                        <TableHead className="text-center font-semibold">Score</TableHead>
                        <TableHead className="text-center font-semibold">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(calculateSectionWiseScores()).map(([section, data]) => (
                        <TableRow key={section}>
                          <TableCell className="font-medium">{section}</TableCell>
                          <TableCell className="text-center">{data.total}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-green-600 dark:text-green-400 font-semibold">{data.correct}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-red-600 dark:text-red-400 font-semibold">{data.incorrect}</span>
                          </TableCell>
                          <TableCell className="text-center font-semibold">{data.score.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={data.percentage >= 60 ? "default" : "destructive"}>
                              {data.percentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={enterReviewMode} variant="default">
                  Review Answers
                </Button>
                <Button onClick={resetTest} variant="default">
                  Reattempt Test
                </Button>
                <Button onClick={() => navigate("/mock-tests")} variant="outline">
                  Back to Tests
                </Button>
                <Button onClick={() => navigate("/lectures")} variant="outline">
                  Back to Lectures
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Motivation Section */}
          <Card>
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
          <Card>
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
                  <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Unable to load analysis. Please try again later.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active Test Interface or Review Mode
  if (testState.isActive || testState.isReviewMode) {
    const currentQuestion = testState.questions[testState.currentQuestionIndex];
    const currentAnswer = testState.userAnswers[currentQuestion?.id];

    // Group questions by section
    const sections = mockTestData?.mockTest || [];
    const sectionQuestions = new Map<string, typeof testState.questions>();
    let questionOffset = 0;

    sections.forEach((section) => {
      const sectionQs = testState.questions.slice(questionOffset, questionOffset + section.questions.length);
      sectionQuestions.set(section.section, sectionQs);
      questionOffset += section.questions.length;
    });

    // Find current section
    const getCurrentSection = () => {
      let offset = 0;
      for (const section of sections) {
        if (testState.currentQuestionIndex < offset + section.questions.length) {
          return section.section;
        }
        offset += section.questions.length;
      }
      return sections[0]?.section || "";
    };

    const currentSection = getCurrentSection();

    // Calculate statistics
    const answeredCount = Object.keys(testState.userAnswers).length;
    const totalQuestions = testState.questions.length;

    // Get section-wise stats
    const getSectionStats = (sectionName: string) => {
      const questions = sectionQuestions.get(sectionName) || [];
      const answered = questions.filter((q) => testState.userAnswers[q.id]).length;
      const correct = questions.filter((q) => testState.userAnswers[q.id]?.isCorrect).length;
      const incorrect = questions.filter((q) => testState.userAnswers[q.id] && !testState.userAnswers[q.id]?.isCorrect).length;
      return { answered, total: questions.length, correct, incorrect };
    };

    // Handle section change
    const handleSectionChange = (sectionName: string) => {
      let offset = 0;
      for (const section of sections) {
        if (section.section === sectionName) {
          goToQuestion(offset);
          break;
        }
        offset += section.questions.length;
      }
    };

    // Toggle mark for review
    const toggleMarkForReview = () => {
      const newMarked = new Set(markedForReview);
      if (newMarked.has(currentQuestion.id)) {
        newMarked.delete(currentQuestion.id);
      } else {
        newMarked.add(currentQuestion.id);
      }
      setMarkedForReview(newMarked);
    };

    // Save and next
    const saveAndNext = () => {
      if (testState.currentQuestionIndex < testState.questions.length - 1) {
        nextQuestion();
      }
    };

    // Clear selection
    const clearSelection = () => {
      answerQuestion(currentQuestion.id, "");
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Top Header */}
        <div className="sticky top-0 z-50 bg-card border-b shadow-sm">
          <div className={cn("px-4 py-2", isMobile && "px-2")}>
            <div className="flex items-center justify-between">
              {/* Left: Zoom */}
              <div className="flex items-center gap-4">
              
              </div>

              {/* Center: Test Title */}
              <div className="text-center">
                <h1 className={cn("font-semibold text-lg", isMobile && "text-sm")}>{mockTestData?.testName}</h1>
              </div>

              {/* Right: Timer & User */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
           
                  {!testState.isReviewMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testState.isPaused ? resumeTest : pauseTest}
                      title={testState.isPaused ? "Resume Test" : "Pause Test"}
                    >
                      {testState.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <div className={cn("text-xs text-muted-foreground", isMobile && "text-[10px]")}>{testState.isPaused ? "Paused" : "Time Left"}</div>
                  <div
                    className={cn(
                      "font-mono font-bold text-xl",
                      testState.timeRemaining < 300 && "text-destructive",
                      testState.isPaused && "text-yellow-600",
                      isMobile && "text-base"
                    )}
                  >
                    {formatTime(testState.timeRemaining)}
                  </div>
                </div>
              
              </div>
            </div>
          </div>

          {/* Instructions & Sections Tabs */}
          <div className="border-t">
            <div className={cn("px-4 py-2 flex justify-between items-center gap-4", isMobile && "px-2 overflow-x-auto")}>
           

              <div className={cn("flex justify-between m-auto gap-10", isMobile && "gap-2 m-0")}>
                {sections.map((section, index) => {
                  const isActive = section.section === currentSection;
                  return (
                    <Button
                      key={section.section}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSectionChange(section.section)}
                      className={cn("text-xs px-3", isActive && "bg-blue-600 text-white hover:bg-blue-700", isMobile && "px-2 text-xs")}
                    >
                      PART-{String.fromCharCode(65 + index)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar - Question Numbers (Desktop Only) */}
          {!isMobile && !sidebarCollapsed && (
            <div className="w-64 border-r bg-card">
              <div className="p-4 border-b bg-muted">
                <div className="flex items-center justify-between">
                  <ChevronLeft
                    className="h-5 w-5 cursor-pointer text-primary"
                    onClick={() => setSidebarCollapsed(true)}
                  />
                  <span className="font-semibold text-sm">{currentSection}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-5 gap-2">
                  {testState.questions.map((question, index) => {
                    const userAnswer = testState.userAnswers[question.id];
                    const isCurrent = index === testState.currentQuestionIndex;
                    const isAnswered = !!userAnswer;
                    const isMarked = markedForReview.has(question.id);
                    const isCorrect = userAnswer?.isCorrect;

                    return (
                      <button
                        key={question.id}
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          "aspect-square rounded text-sm font-semibold transition-all",
                          isCurrent && "ring-2 ring-primary ring-offset-2",
                          // Review mode: show correct/incorrect colors
                          testState.isReviewMode && isAnswered && !isMarked && isCorrect && "bg-green-600 text-white",
                          testState.isReviewMode && isAnswered && !isMarked && !isCorrect && "bg-red-600 text-white",
                          // Active mode: show answered in green
                          !testState.isReviewMode && isAnswered && !isMarked && "bg-green-600 text-white",
                          // Common: marked for review and unanswered
                          isMarked && "bg-purple-600 text-white",
                          !isAnswered && !isMarked && "bg-muted hover:bg-muted/80",
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section Analysis */}
              {testState.isReviewMode && (
                <div className="p-4 border-t bg-muted/50">
                  <div className="text-sm font-semibold mb-2">{currentSection} Analysis</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Answered</span>
                      <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                        {getSectionStats(currentSection).answered}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Correct</span>
                      <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold">
                        {getSectionStats(currentSection).correct}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incorrect</span>
                      <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-semibold">
                        {getSectionStats(currentSection).incorrect}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Not Answered</span>
                      <span className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                        {getSectionStats(currentSection).total - getSectionStats(currentSection).answered}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isMobile && sidebarCollapsed && (
            <div className="w-12 border-r bg-card flex items-start justify-center pt-4">
              <ChevronRight
                className="h-5 w-5 cursor-pointer text-primary"
                onClick={() => setSidebarCollapsed(false)}
              />
            </div>
          )}

          {/* Main Content */}
          <div className={cn("flex-1 p-6", isMobile && "p-4")}>
            <div className={cn("max-w-5xl mx-auto", isMobile && "max-w-full")}>
              {/* Question Header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Question No. {testState.currentQuestionIndex + 1}</h2>
              </div>

              {/* Question Content */}
              <div className="bg-card rounded-lg p-6 mb-6 border">
                {(() => {
                  const questionText =
                    testState.language === "hindi"
                      ? currentQuestion["question-hindi"]
                      : currentQuestion["question-english"];
                  const options =
                    testState.language === "hindi"
                      ? currentQuestion["options-hindi"]
                      : currentQuestion["options-english"];

                  const hasQuestionImage = currentQuestion["question-image"];
                  const isQuestionTextUrl = questionText.startsWith("http://") || questionText.startsWith("https://");

                  return (
                    <>
                      {/* Show question-image if it exists */}
                      {hasQuestionImage && (
                        <div className={cn("mb-4", testState.isPaused && "blur-sm")}>
                          <img 
                            src={currentQuestion["question-image"]} 
                            alt="Question" 
                            className="max-w-full h-auto rounded-lg border"
                            onError={(e) => {
                              console.error('Failed to load question image:', currentQuestion["question-image"]);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Show question text below image or as standalone */}
                      <div className={cn("mb-6", testState.isPaused && "blur-sm")}>
                        {hasQuestionImage ? (
                          // If question-image exists, always show text below it
                          <p className="text-base leading-relaxed">{questionText}</p>
                        ) : isQuestionTextUrl ? (
                          // If no question-image but text is URL, show as image
                          <img 
                            src={questionText} 
                            alt="Question" 
                            className="max-w-full h-auto rounded-lg border"
                            onError={(e) => {
                              console.error('Failed to load question text as image:', questionText);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          // Otherwise show as text
                          <p style={{whiteSpace : 'pre-line'}}  className="text-base leading-relaxed">{questionText}</p>
                        )}
                      </div>

                      <RadioGroup
                        value={currentAnswer?.selectedOption || ""}
                        onValueChange={(value) => answerQuestion(currentQuestion.id, value)}
                        className={cn("space-y-3", testState.isPaused && "blur-sm pointer-events-none")}
                        disabled={testState.isPaused}
                      >
                        {testState.isReviewMode
                          ? options.map((option, index) => {
                              const correctAnswer =
                                testState.language === "hindi"
                                  ? currentQuestion["answer-hindi"]
                                  : currentQuestion["answer-english"];
                              const isCorrectOption = option === correctAnswer;
                              const isSelectedOption = currentAnswer?.selectedOption === option;
                              const isWrongSelection = isSelectedOption && !currentAnswer?.isCorrect;
                              const wasNotAttempted = !currentAnswer;

                              return (
                                <div
                                  key={index}
                                  className={cn(
                                    "p-4 rounded-lg border-2 transition-colors",
                                    isCorrectOption && "border-green-500 bg-green-50 dark:bg-green-950",
                                    isWrongSelection && "border-red-500 bg-red-50 dark:bg-red-950",
                                    !isCorrectOption && !isWrongSelection && "border-border",
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    {isCorrectOption && <CheckCircle className="h-5 w-5 text-green-600" />}
                                    {isWrongSelection && <XCircle className="h-5 w-5 text-red-600" />}
                                    <div className="flex-1">
                                      {typeof option === "string" &&
                                      (option.startsWith("http://") || option.startsWith("https://")) ? (
                                        <img
                                          src={option}
                                          alt={`Option ${index + 1}`}
                                          className="max-w-full h-auto rounded-md max-h-32 object-contain"
                                        />
                                      ) : (
                                        <span className="text-base">{option}</span>
                                      )}
                                    </div>
                                    {/* Show indicators for attempted vs correct answers */}
                                    <div className="flex flex-col items-end gap-1">
                                      {isCorrectOption && (
                                        <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                                          Correct Answer
                                        </span>
                                      )}
                                      {isSelectedOption && !isCorrectOption && (
                                        <span className="text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                                          Your Answer
                                        </span>
                                      )}
                                      {wasNotAttempted && isCorrectOption && (
                                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                                          Not Attempted
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          : options.map((option, index) => {
                              const isImageUrl =
                                typeof option === "string" &&
                                (option.startsWith("http://") || option.startsWith("https://"));

                              return (
                                <div
                                  key={index}
                                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                                >
                                  <RadioGroupItem value={option} id={`option-${index}`} />
                                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                                    {isImageUrl ? (
                                      <img
                                        src={option}
                                        alt={`Option ${index + 1}`}
                                        className="max-w-full h-auto rounded-md max-h-32 object-contain"
                                      />
                                    ) : (
                                      option
                                    )}
                                  </Label>
                                </div>
                              );
                            })}
                      </RadioGroup>

                      {/* Solution Section (Review Mode Only) */}
                      {testState.isReviewMode && (
                        <div className="mt-6 p-4 bg-muted rounded-lg border-l-4 border-primary">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            Solution:
                          </h4>
                          <p className="text-sm leading-relaxed">
                            {testState.language === "hindi"
                              ? currentQuestion["solution-hindi"]
                              : currentQuestion["solution-english"]}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className={cn("flex items-center justify-center gap-3", isMobile && "flex-wrap gap-2 pb-20")}>
                {!testState.isReviewMode && (
                  <>
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={previousQuestion}
                      disabled={testState.currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      {!isMobile && "Previous"}
                    </Button>
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={toggleMarkForReview}
                      className={markedForReview.has(currentQuestion.id) ? "bg-purple-100 dark:bg-purple-900" : ""}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      {!isMobile && "Mark for Review"}
                    </Button>
                    <Button variant="default" size={isMobile ? "sm" : "default"} onClick={saveAndNext}>
                      Save & Next
                    </Button>
                    <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={clearSelection}>
                      {isMobile ? "Clear" : "Clear Selection"}
                    </Button>
                    <Button variant="destructive" size={isMobile ? "sm" : "default"} onClick={submitTest}>
                      Submit
                    </Button>
                  </>
                )}
                {testState.isReviewMode && (
                  <>
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={previousQuestion}
                      disabled={testState.currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={nextQuestion}
                      disabled={testState.currentQuestionIndex === testState.questions.length - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button onClick={() => navigate("/mock-tests")} variant="default" size={isMobile ? "sm" : "default"}>
                      Back to Tests
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stats (Desktop Only) */}
          {!isMobile && (
            <div className="w-80 border-l bg-card p-4">
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Total Questions Answered</div>
                  <div className="text-3xl font-bold text-orange-600">{answeredCount}</div>
                  <div className="text-sm font-semibold text-orange-600">
                    Last {Math.floor(mockTestData?.duration || 90)} Minutes
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Select Language</span>
                    <ToggleGroup
                      type="single"
                      value={testState.language}
                      onValueChange={(value) => value && switchLanguage(value as Language)}
                      size="sm"
                    >
                      <ToggleGroupItem value="english" aria-label="English" className="text-xs">
                        English
                      </ToggleGroupItem>
                      <ToggleGroupItem value="hindi" aria-label="Hindi" className="text-xs">
                        हिंदी
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Question Navigation Sheet */}
        {isMobile && (
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <div className="space-y-4 py-4">
                <h3 className="text-lg font-semibold">Question Navigation</h3>
                
                {/* Section Tabs */}
                <div className="flex flex-wrap gap-2">
                  {sections.map((section, index) => {
                    const isActive = section.section === currentSection;
                    return (
                      <Button
                        key={section.section}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          handleSectionChange(section.section);
                          setMobileSheetOpen(false);
                        }}
                        className={cn("text-xs px-3", isActive && "bg-blue-600 text-white hover:bg-blue-700")}
                      >
                        PART-{String.fromCharCode(65 + index)}
                      </Button>
                    );
                  })}
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {testState.questions.map((question, index) => {
                    const userAnswer = testState.userAnswers[question.id];
                    const isCurrent = index === testState.currentQuestionIndex;
                    const isAnswered = !!userAnswer;
                    const isMarked = markedForReview.has(question.id);
                    const isCorrect = userAnswer?.isCorrect;

                    return (
                      <button
                        key={question.id}
                        onClick={() => {
                          goToQuestion(index);
                          setMobileSheetOpen(false);
                        }}
                        className={cn(
                          "aspect-square rounded text-sm font-semibold transition-all",
                          isCurrent && "ring-2 ring-primary ring-offset-2",
                          testState.isReviewMode && isAnswered && !isMarked && isCorrect && "bg-green-600 text-white",
                          testState.isReviewMode && isAnswered && !isMarked && !isCorrect && "bg-red-600 text-white",
                          !testState.isReviewMode && isAnswered && !isMarked && "bg-green-600 text-white",
                          isMarked && "bg-purple-600 text-white",
                          !isAnswered && !isMarked && "bg-muted hover:bg-muted/80",
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Section Analysis */}
                {testState.isReviewMode && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="text-sm font-semibold mb-2">{currentSection} Analysis</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Answered</span>
                        <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                          {getSectionStats(currentSection).answered}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correct</span>
                        <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold">
                          {getSectionStats(currentSection).correct}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incorrect</span>
                        <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-semibold">
                          {getSectionStats(currentSection).incorrect}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Not Answered</span>
                        <span className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                          {getSectionStats(currentSection).total - getSectionStats(currentSection).answered}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Language Selection (Mobile) */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold">Select Language</div>
                  <ToggleGroup
                    type="single"
                    value={testState.language}
                    onValueChange={(value) => value && switchLanguage(value as Language)}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="english" aria-label="English">
                      English
                    </ToggleGroupItem>
                    <ToggleGroupItem value="hindi" aria-label="Hindi">
                      हिंदी
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Stats (Mobile) */}
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Total Questions Answered</div>
                  <div className="text-3xl font-bold text-orange-600">{answeredCount}</div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  return null;
};

export default MockTest;
