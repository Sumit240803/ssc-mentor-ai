import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Play, 
  Users,
  ArrowRight,
  Brain,
  Zap,
  Target,
  Sparkles,
  Bot,
  ChevronRight,
  Star,
  CheckCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

const Landing = () => {
  const { user } = useAuth();
  const { hasPaid } = usePaymentStatus();
  const navigate = useNavigate();

  const handleStartJourney = () => {
    if (user && hasPaid) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced neural networks analyze your learning patterns to create personalized study paths that adapt to your pace"
    },
    {
      icon: Zap,
      title: "Smart Insights",
      description: "Real-time analytics and AI-generated insights help you identify weak areas and optimize your study time"
    },
    {
      icon: Target,
      title: "Precision Learning",
      description: "AI algorithms track your progress and adjust difficulty levels to ensure maximum learning efficiency"
    },
    {
      icon: Bot,
      title: "24/7 AI Mentor",
      description: "Your personal AI assistant provides instant answers, explanations, and guidance whenever you need it"
    }
  ];

  const stats = [
    { number: "50,000+", label: "AI-Guided Students", icon: Users },
    { number: "1M+", label: "AI Interactions", icon: MessageCircle },
    { number: "98%", label: "Success Rate", icon: Target },
    { number: "24/7", label: "AI Support", icon: Bot }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      score: "SSC CGL Qualified",
      text: "The AI mentor helped me identify my weak areas and created a perfect study plan. Cleared SSC CGL on first attempt!",
      rating: 5
    },
    {
      name: "Rahul Kumar", 
      score: "SSC CHSL Selected",
      text: "Amazing AI-powered summaries and personalized practice. The chatbot answered all my doubts instantly.",
      rating: 5
    },
    {
      name: "Sneha Patel",
      score: "SSC MTS Cleared",
      text: "Best investment I made for my preparation. The AI study schedule was perfect for my busy lifestyle.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar/>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-glow rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-ai-secondary rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-32 h-32 bg-gradient-neural rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
        
        {/* Neural Network Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-semibold animate-pulse-glow">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Advanced AI Technology
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in bg-gradient-neural bg-clip-text text-transparent">
            AI-Powered
            <br />
            <span className="bg-gradient-ai-primary bg-clip-text text-transparent">
              SSC Mastery
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Experience the future of learning with our advanced AI mentor that personalizes your SSC preparation journey, 
            adapts to your learning style, and ensures guaranteed success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in mb-12" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-ai-primary hover:shadow-ai-glow transition-all duration-300 animate-pulse-glow" onClick={handleStartJourney}>
              Start AI Learning Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/5">
              <Play className="mr-2 h-5 w-5" />
              Watch AI Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-primary" />
              AI-Verified Content
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-primary" />
              Neural Learning Paths  
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-primary" />
              Real-time Progress AI
            </div>
          </div>
        </div>
      </section>

      {/* AI Stats Section */}
      <section className="py-20 bg-gradient-subtle relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-ai-secondary bg-clip-text text-transparent">
              Powered by Cutting-Edge AI
            </h2>
            <p className="text-lg text-muted-foreground">Our AI technology is transforming how students learn and succeed</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-gradient-ai-primary p-4 rounded-2xl w-fit mx-auto mb-4 animate-pulse-glow">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
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

      {/* AI Features Section */}
      <section className="py-20 bg-background relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Next-Generation Learning
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              AI Features That{" "}
              <span className="bg-gradient-neural bg-clip-text text-transparent">Guarantee Success</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced AI algorithms work 24/7 to optimize your learning experience and ensure you achieve your SSC goals faster than ever before
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-8 hover:shadow-floating transition-all duration-500 hover:-translate-y-2 animate-slide-up border-0 bg-gradient-card relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="p-4 bg-gradient-ai-primary rounded-2xl w-fit mb-6 animate-pulse-glow">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success Stories from Our{" "}
              <span className="bg-gradient-ai-primary bg-clip-text text-transparent">AI-Guided Students</span>
            </h2>
            <p className="text-xl text-muted-foreground">See how our AI technology helped students achieve their dreams</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-background border-0 shadow-elevated hover:shadow-floating transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-primary font-medium">{testimonial.score}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-neural opacity-5"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="bg-gradient-card rounded-3xl p-8 md:p-12 shadow-floating border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
            
            <div className="relative z-10">
              <Badge variant="secondary" className="mb-6 px-4 py-2 animate-pulse-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                Limited Time: 50% Off First Month
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Experience{" "}
                <span className="bg-gradient-neural bg-clip-text text-transparent">AI-Powered Learning?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join over 50,000 students who are already using our advanced AI technology to crack SSC exams with unprecedented success rates
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-ai-primary hover:shadow-ai-glow transition-all duration-300 animate-pulse-glow" onClick={handleStartJourney}>
                  Start Your AI Journey - ₹499
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/5">
                  Schedule AI Demo
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                  Instant AI Access
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                  30-Day Money Back
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                  24/7 AI Mentor
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;