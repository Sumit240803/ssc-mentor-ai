import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Brain, 
  Calculator, 
  Globe, 
  Laptop, 
  Lock, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useStudyPlan } from '@/hooks/useStudyPlan';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SubjectIconProps {
  subject: string;
  className?: string;
}

const SubjectIcon = ({ subject, className = "h-4 w-4" }: SubjectIconProps) => {
  switch (subject) {
    case 'math':
      return <Calculator className={className} />;
    case 'general_studies':
      return <BookOpen className={className} />;
    case 'reasoning':
      return <Brain className={className} />;
    case 'static_gk':
      return <Globe className={className} />;
    case 'computer_current_affairs':
      return <Laptop className={className} />;
    default:
      return <BookOpen className={className} />;
  }
};

const subjectLabels = {
  math: 'Mathematics',
  general_studies: 'General Studies',
  reasoning: 'Reasoning',
  static_gk: 'Static GK',
  computer_current_affairs: 'Computer & Current Affairs'
};

export const StudyPlanProgress = () => {
  const { user } = useAuth();
  const {
    userFullPlan,
    currentDay,
    loading,
    updatingProgress,
    updateProgress,
    stats
  } = useStudyPlan();

  const [expandedDay, setExpandedDay] = useState<number | null>(currentDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Login Required
          </h3>
          <p className="text-muted-foreground">
            Please log in to access your personalized 45-day study plan and track your progress.
          </p>
        </div>
      </Card>
    );
  }

  const isDayUnlocked = (dayNumber: number): boolean => {
    if (dayNumber === 1) return true;
    const previousDay = userFullPlan.find(d => d.day_number === dayNumber - 1);
    return !!previousDay?.progress.completed_at;
  };

  const isDayCompleted = (dayNumber: number): boolean => {
    const day = userFullPlan.find(d => d.day_number === dayNumber);
    return !!day?.progress.completed_at;
  };

  const getSubjectProgress = (dayNumber: number) => {
    const day = userFullPlan.find(d => d.day_number === dayNumber);
    if (!day) return 0;
    
    const completed = [
      day.progress.math_done,
      day.progress.general_studies_done,
      day.progress.reasoning_done,
      day.progress.static_gk_done,
      day.progress.computer_current_affairs_done
    ].filter(Boolean).length;
    
    return (completed / 5) * 100;
  };

  const handleSubjectToggle = async (
    dayNumber: number, 
    subject: string, 
    checked: boolean
  ) => {
    if (!isDayUnlocked(dayNumber)) return;
    const subjectKey = `${subject}_done` as 'math_done' | 'general_studies_done' | 'reasoning_done' | 'static_gk_done' | 'computer_current_affairs_done';
    await updateProgress(dayNumber, subjectKey, checked);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Day</p>
              <p className="text-2xl font-bold text-foreground">{stats.currentDay}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.completedDays}/{stats.totalDays}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects Done</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.completedSubjects}/{stats.totalSubjects}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold text-foreground">{stats.progressPercentage}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Progress Bar */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Overall Study Plan Progress
            </h3>
            <Badge variant="secondary">
              {stats.completedDays} of {stats.totalDays} days
            </Badge>
          </div>
          <Progress value={stats.progressPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {stats.progressPercentage}% complete - Keep going! 🚀
          </p>
        </div>
      </Card>

      {/* Study Plan Days */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            45-Day Study Plan
          </h3>
          <p className="text-muted-foreground">
            Track your daily progress across all subjects. Complete Day {currentDay > 1 ? currentDay - 1 : currentDay} to unlock Day {currentDay + 1}.
          </p>
        </div>

        <Accordion 
          type="single" 
          collapsible 
          value={expandedDay?.toString()}
          onValueChange={(value) => setExpandedDay(value ? parseInt(value) : null)}
        >
          {userFullPlan.map((day) => {
            const unlocked = isDayUnlocked(day.day_number);
            const completed = isDayCompleted(day.day_number);
            const progress = getSubjectProgress(day.day_number);
            const isCurrent = day.day_number === currentDay;

            return (
              <AccordionItem 
                key={day.day_number} 
                value={day.day_number.toString()}
                className="border rounded-lg mb-3 overflow-hidden"
              >
                <AccordionTrigger 
                  className={`px-6 py-4 hover:no-underline ${
                    !unlocked ? 'opacity-60 cursor-not-allowed' : ''
                  } ${isCurrent ? 'bg-primary/5' : ''}`}
                  disabled={!unlocked}
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        completed ? 'bg-green-500' : 
                        isCurrent ? 'bg-primary' : 
                        unlocked ? 'bg-muted' : 'bg-muted'
                      }`}>
                        {!unlocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : completed ? (
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                          <span className={`text-lg font-bold ${
                            isCurrent ? 'text-primary-foreground' : 'text-foreground'
                          }`}>
                            {day.day_number}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-semibold text-foreground">
                            Day {day.day_number}
                          </h4>
                          {isCurrent && (
                            <Badge className="bg-primary text-primary-foreground">
                              Current
                            </Badge>
                          )}
                          {completed && (
                            <Badge className="bg-green-500 text-white">
                              Completed
                            </Badge>
                          )}
                          {!unlocked && (
                            <Badge variant="secondary">Locked</Badge>
                          )}
                        </div>
                        {unlocked && !completed && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={progress} className="h-2 w-32" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 py-4 bg-card">
                  {unlocked && (
                    <div className="space-y-4">
                      {/* Mathematics */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`day-${day.day_number}-math`}
                          checked={day.progress.math_done}
                          onCheckedChange={(checked) => 
                            handleSubjectToggle(day.day_number, 'math', checked as boolean)
                          }
                          disabled={updatingProgress}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`day-${day.day_number}-math`}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Calculator className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-foreground">
                              {subjectLabels.math}
                            </span>
                          </label>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            {day.math}
                          </p>
                        </div>
                      </div>

                      {/* General Studies */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`day-${day.day_number}-gs`}
                          checked={day.progress.general_studies_done}
                          onCheckedChange={(checked) => 
                            handleSubjectToggle(day.day_number, 'general_studies', checked as boolean)
                          }
                          disabled={updatingProgress}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`day-${day.day_number}-gs`}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <BookOpen className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-foreground">
                              {subjectLabels.general_studies}
                            </span>
                          </label>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            {day.general_studies}
                          </p>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`day-${day.day_number}-reasoning`}
                          checked={day.progress.reasoning_done}
                          onCheckedChange={(checked) => 
                            handleSubjectToggle(day.day_number, 'reasoning', checked as boolean)
                          }
                          disabled={updatingProgress}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`day-${day.day_number}-reasoning`}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Brain className="h-4 w-4 text-purple-500" />
                            <span className="font-medium text-foreground">
                              {subjectLabels.reasoning}
                            </span>
                          </label>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            {day.reasoning}
                          </p>
                        </div>
                      </div>

                      {/* Static GK */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`day-${day.day_number}-gk`}
                          checked={day.progress.static_gk_done}
                          onCheckedChange={(checked) => 
                            handleSubjectToggle(day.day_number, 'static_gk', checked as boolean)
                          }
                          disabled={updatingProgress}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`day-${day.day_number}-gk`}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Globe className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-foreground">
                              {subjectLabels.static_gk}
                            </span>
                          </label>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            {day.static_gk}
                          </p>
                        </div>
                      </div>

                      {/* Computer & Current Affairs */}
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`day-${day.day_number}-comp`}
                          checked={day.progress.computer_current_affairs_done}
                          onCheckedChange={(checked) => 
                            handleSubjectToggle(day.day_number, 'computer_current_affairs', checked as boolean)
                          }
                          disabled={updatingProgress}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`day-${day.day_number}-comp`}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Laptop className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-foreground">
                              {subjectLabels.computer_current_affairs}
                            </span>
                          </label>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            {day.computer_current_affairs}
                          </p>
                        </div>
                      </div>

                      {completed && day.progress.completed_at && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-400 flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              Completed on {new Date(day.progress.completed_at).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>
    </div>
  );
};
