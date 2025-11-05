import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  Brain,
  BookOpen,
  Headphones,
  Target,
  Clock,
  CheckCircle,
  X,
  Sparkles,
  Zap,
  Award
} from "lucide-react";

interface FeatureInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeatureInfoModal: React.FC<FeatureInfoModalProps> = ({ open, onOpenChange }) => {
  const features = [
    {
      title: "Mock Tests",
      description: "25+ mock tests to prepare for the exam",
      icon: FileText,
      details: [
        "Comprehensive practice tests covering all subjects",
        "Real exam-like interface and timing",
        "Detailed performance analytics",
        "Section-wise score breakdown"
      ],
      badge: "25+ Tests",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Lectures",
      description: "AI powered lectures which will boost up your progress, just listen and learn",
      icon: Brain,
      details: [
        "AI-powered personalized learning paths",
        "Audio lectures for on-the-go learning",
        "Interactive study materials",
        "Smart progress tracking"
      ],
      badge: "AI Powered",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Schedules",
      description: "Comprehensive guide to prepare for your exam",
      icon: Calendar,
      details: [
        "Structured study plans tailored to your needs",
        "Daily, weekly, and monthly schedules",
        "Exam date countdown and reminders",
        "Flexible schedule adjustments"
      ],
      badge: "Smart Planning",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className="absolute -top-2 -right-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-muted rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center space-y-4 pr-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <DialogTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Welcome to SSC Mentor AI
              </DialogTitle>
              <p className="text-muted-foreground text-lg">
                Your intelligent companion for SSC exam preparation
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Benefits Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-600/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="w-6 h-6 text-primary" />
                Why Choose SSC Mentor AI?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">AI-Powered Learning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Personalized Study Plans</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Fast Track Progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Comprehensive Content</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center space-y-4 pt-4">
            <p className="text-muted-foreground">
              Ready to supercharge your SSC exam preparation?
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all duration-300"
            >
              Get Started
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureInfoModal;