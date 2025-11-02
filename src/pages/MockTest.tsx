import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useMockTest, MockTestAnalysis, Language } from '@/hooks/useMockTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const MockTest: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [motivation, setMotivation] = useState<{ message: string } | null>(null);
  const [analysis, setAnalysis] = useState<MockTestAnalysis | null>(null);
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('hindi');
  
  const {
    mockTestData,
    testState,
    startTest,
    submitTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    getResults,
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
              {mockTestData?.testName || 'Mock Test'}
            </CardTitle>
            <CardDescription className="text-lg">
              Full-length practice test
            </CardDescription>
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
                    Total: {mockTestData?.mockTest.reduce((total, section) => total + section.questions.length, 0)} questions
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
                  <li>• No negative marking</li>
                  <li>• Can review and change answers</li>
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
                        <span className="text-sm font-medium">
                          Attempt {previousResults.length - index}
                        </span>
                        <Badge variant={result.percentage >= 75 ? "default" : result.percentage >= 50 ? "secondary" : "destructive"}>
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
                        {new Date(result.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
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

            <Button 
              onClick={() => startTest(selectedLanguage)} 
              size="lg" 
              className="w-full"
              variant="default"
            >
              {previousResults.length > 0 ? 'Retake Test' : 'Start Test'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Test Interface or Review Mode
  if (testState.isActive || testState.isReviewMode) {
    const currentQuestion = testState.questions[testState.currentQuestionIndex];
    const currentAnswer = testState.userAnswers[currentQuestion?.id];
    const progress = ((testState.currentQuestionIndex + 1) / testState.questions.length) * 100;

    // Results Screen
    if (testState.isCompleted) {
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
                <CardDescription>
                  Your performance summary
                </CardDescription>
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
                    <div className="text-3xl font-bold text-primary mb-2">
                      {results.percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">Percentage</div>
                  </div>
                  <div className="text-center p-6 bg-card rounded-lg border">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatTime(results.timeTaken)}
                    </div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
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
                    <div className="font-semibold text-yellow-700 dark:text-yellow-300">{results.unansweredQuestions}</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">Unanswered</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-700 dark:text-blue-300">{results.answeredQuestions}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Attempted</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={enterReviewMode} variant="default">
                    Review Answers
                  </Button>
                  <Button onClick={() => navigate('/mock-tests')} variant="outline">
                    Back to Tests
                  </Button>
                  <Button onClick={() => navigate('/lectures')} variant="outline">
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
                <CardDescription>
                  A message to keep you motivated
                </CardDescription>
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
                <CardDescription>
                  Personalized insights about your performance
                </CardDescription>
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

    // Active Test or Review Interface
    return (
      <div className="min-h-screen bg-background">
        {/* Timer Bar or Review Header */}
        <div className="sticky top-0 z-50 bg-card border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              {testState.isReviewMode ? (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">Review Mode</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className={cn(
                    "h-5 w-5",
                    testState.timeRemaining < 300 ? "text-destructive animate-pulse" : "text-primary"
                  )} />
                  <span className={cn(
                    "font-mono font-semibold text-lg",
                    testState.timeRemaining < 300 && "text-destructive"
                  )}>
                    {formatTime(testState.timeRemaining)}
                  </span>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Question {testState.currentQuestionIndex + 1} of {testState.questions.length}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!testState.isReviewMode && (
                <ToggleGroup 
                  type="single" 
                  value={testState.language}
                  onValueChange={(value) => value && switchLanguage(value as Language)}
                  size="sm"
                >
                  <ToggleGroupItem value="hindi" aria-label="Hindi">
                    <Languages className="h-4 w-4 mr-1" />
                    हिं
                  </ToggleGroupItem>
                  <ToggleGroupItem value="english" aria-label="English">
                    <Languages className="h-4 w-4 mr-1" />
                    EN
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {currentQuestion ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      Question {testState.currentQuestionIndex + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{currentQuestion.section}</Badge>
                      {currentQuestion.pyq && (
                        <Badge variant="secondary">
                          PYQ {currentQuestion.pyqDetails.year}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(() => {
                    const questionText = testState.language === 'hindi' 
                      ? currentQuestion['question-hindi'] 
                      : currentQuestion['question-english'];
                    const options = testState.language === 'hindi'
                      ? currentQuestion['options-hindi']
                      : currentQuestion['options-english'];
                    
                    const isQuestionImage = questionText.startsWith('http://') || questionText.startsWith('https://');
                    
                    return (
                      <>
                        {isQuestionImage ? (
                          <img 
                            src={questionText} 
                            alt="Question" 
                            className="max-w-full h-auto rounded-lg"
                          />
                        ) : (
                          <p className="text-lg leading-relaxed">{questionText}</p>
                        )}
                        
                        <RadioGroup
                          value={currentAnswer?.selectedOption || ''}
                          onValueChange={(value) => answerQuestion(currentQuestion.id, value)}
                          className="space-y-3"
                        >
                        {testState.isReviewMode ? (
                          options.map((option, index) => {
                            const correctAnswer = testState.language === 'hindi' 
                              ? currentQuestion['answer-hindi']
                              : currentQuestion['answer-english'];
                            const isCorrectOption = option === correctAnswer;
                            const isSelectedOption = currentAnswer?.selectedOption === option;
                            const isWrongSelection = isSelectedOption && !currentAnswer?.isCorrect;
                            
                            return (
                              <div 
                                key={index} 
                                className={cn(
                                  "p-4 rounded-lg border-2 transition-colors",
                                  isCorrectOption && "border-green-500 bg-green-50 dark:bg-green-950",
                                  isWrongSelection && "border-red-500 bg-red-50 dark:bg-red-950",
                                  !isCorrectOption && !isWrongSelection && "border-border"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  {isCorrectOption && <CheckCircle className="h-5 w-5 text-green-600" />}
                                  {isWrongSelection && <XCircle className="h-5 w-5 text-red-600" />}
                                  <div className="flex-1">
                                    {typeof option === 'string' && (option.startsWith('http://') || option.startsWith('https://')) ? (
                                      <img 
                                        src={option} 
                                        alt={`Option ${index + 1}`} 
                                        className="max-w-full h-auto rounded-md max-h-32 object-contain"
                                      />
                                    ) : (
                                      <span className="text-base">{option}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          options.map((option, index) => {
                            const isImageUrl = typeof option === 'string' && (option.startsWith('http://') || option.startsWith('https://'));
                            
                            return (
                              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label 
                                  htmlFor={`option-${index}`} 
                                  className="flex-1 cursor-pointer text-base"
                                >
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
                          })
                        )}
                        </RadioGroup>
                      </>
                    );
                  })()}
                  
                  {/* Solution Section (Review Mode Only) */}
                  {testState.isReviewMode && (
                    <div className="mt-6 p-4 bg-muted rounded-lg border-l-4 border-primary">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Solution:
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {testState.language === 'hindi' 
                          ? currentQuestion['solution-hindi']
                          : currentQuestion['solution-english']}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Loading question...</p>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                onClick={previousQuestion}
                disabled={testState.currentQuestionIndex === 0}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {testState.isReviewMode ? (
                testState.currentQuestionIndex === testState.questions.length - 1 ? (
                  <Button onClick={() => navigate('/mock-tests')} variant="default">
                    Back to Mock Tests
                  </Button>
                ) : null
              ) : (
                <Button onClick={submitTest} variant="destructive">
                  Submit Test
                </Button>
              )}
              
              <Button
                onClick={nextQuestion}
                disabled={testState.currentQuestionIndex === testState.questions.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Question Navigation Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {testState.questions.map((question, index) => {
                    const userAnswer = testState.userAnswers[question.id];
                    const isCurrent = index === testState.currentQuestionIndex;
                    const isWrong = testState.isReviewMode && userAnswer && !userAnswer.isCorrect;
                    
                    return (
                      <Button
                        key={question.id}
                        variant={
                          isCurrent 
                            ? "default" 
                            : isWrong
                            ? "destructive"
                            : userAnswer 
                            ? "secondary" 
                            : "outline"
                        }
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 text-xs",
                          isCurrent && "ring-2 ring-primary/50"
                        )}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border rounded"></div>
                    <span>Not Answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MockTest;