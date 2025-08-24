import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Play, 
  Users,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Video Lectures",
      description: "Comprehensive lectures for GS, Maths, Reasoning, and English with AI-generated summaries"
    },
    {
      icon: Calendar,
      title: "Smart Schedule",
      description: "Personalized study plans and daily tasks to help you reach your SSC goals"
    },
    {
      icon: TrendingUp,
      title: "AI Summaries",
      description: "Concise, AI-powered summaries for every lecture to reinforce your learning"
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Support",
      description: "Get instant help with doubts and questions through our intelligent chatbot"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students Learning" },
    { number: "500+", label: "Video Lectures" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            AI Mentor for{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              SSC Students
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Master your SSC preparation with personalized video lectures, AI-powered summaries, and smart study schedules
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/auth">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines the best of technology and education to accelerate your SSC preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-slide-up border-0 shadow-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="p-3 bg-gradient-hero rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-elevated">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your SSC Preparation?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who are already achieving their dreams with our AI-powered learning platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Start Learning Today
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;