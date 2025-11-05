import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  BookOpen,
  Video,
  Users,
  Award,
  Brain,
  Zap,
  Target,
  Bot,
  Sparkles,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { hasPaid, loading: paymentLoading } = usePaymentStatus();

  // Redirect if user has already paid
  useEffect(() => {
  // Avoid infinite redirects by ensuring both are done loading
  if (!paymentLoading && hasPaid) {
    navigate("/lectures", { replace: true });
  }
}, [hasPaid, paymentLoading]);


  const handlePayment = async () => {
    console.log("Payment initiated");

    if (!user) {
      toast({
        title: "Error",
        description: "Please login to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Creating payment record...");
      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          amount: 49900,
          currency: "INR",
          status: "pending",
        })
        .select()
        .single();

      if (paymentError) {
        console.error("Payment creation error:", paymentError);
        throw paymentError;
      }

      console.log("Payment record created:", paymentData);
      console.log("Razorpay available:", !!window.Razorpay);

      // Initialize Razorpay
      const options = {
        key: "rzp_test_RAQLUXcbIAyLns",
        amount: 49900, // 499 rupees in paise
        currency: "INR",
        name: "EduPlatform",
        description: "Premium Course Access",
        // For test mode, we don't need to create a server-side order
        handler: async function (response: any) {
          try {
            // Update payment record with Razorpay details
            const { error: updateError } = await supabase
              .from("payments")
              .update({
                razorpay_payment_id: response.razorpay_payment_id,
                status: "completed",
              })
              .eq("id", paymentData.id);

            if (updateError) {
              throw updateError;
            }

            // Update user profile payment status
            const { error: profileError } = await supabase
              .from("profiles")
              .update({ payment_status: "completed" })
              .eq("user_id", user.id);

            if (profileError) {
              throw profileError;
            }

            toast({
              title: "Payment Successful!",
              description: "Welcome to EduPlatform Premium! You now have access to all courses.",
            });

           window.location.href = "/lectures";
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if money was deducted.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      console.log("Razorpay options:", options);
      const rzp = new window.Razorpay(options);
      console.log("Razorpay instance created:", rzp);

      rzp.on("payment.failed", async function (response: any) {
        console.log("Payment failed:", response);
        // Update payment status to failed
        await supabase
          .from("payments")
          .update({
            status: "failed",
            razorpay_payment_id: response.error.metadata?.payment_id || null,
          })
          .eq("id", paymentData.id);

        toast({
          title: "Payment Failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      });

      console.log("Opening Razorpay...");
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Brain, text: "AI-Powered Personalized Learning Paths", premium: true },
    { icon: Bot, text: "24/7 AI Mentor & Doubt Resolution", premium: true },
    { icon: Target, text: "AI-Driven Progress Analytics & Insights", premium: true },
    { icon: Award, text: "AI-Verified Course Completion Certificates", premium: true },
    { icon: Users, text: "Live Interactive Sessions with AI Assistance", premium: true },
    { icon: Check, text: "Download AI-Generated Study Materials", premium: true },
    { icon: CheckCircle, text: "Priority AI Support & Updates", premium: true },
  ];

  const testimonials = [
    {
      name: "Amit Sharma",
      achievement: "SSC CGL Cleared - Tier 1 & 2",
      text: "The AI mentor identified my weak areas and created a perfect study plan. The personalized approach made all the difference!",
      rating: 5,
      image: "👨‍💼",
    },
    {
      name: "Priya Patel",
      achievement: "SSC CHSL Selected",
      text: "Amazing AI-powered practice questions and instant doubt resolution. The AI explanations were incredibly helpful.",
      rating: 5,
      image: "👩‍🎓",
    },
  ];

  // Countdown timer effect
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-6 px-6 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            AI-Powered Learning Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-neural bg-clip-text text-transparent">Transform Your</span>
            <br />
            <span className="text-foreground">SSC Preparation</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful students using our AI-powered platform to ace their SSC exams
          </p>

          {/* Limited Time Banner */}
          <div className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-elevated animate-pulse-glow">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Limited Offer: 50% OFF</span>
            <div className="flex gap-2 ml-2">
              <span className="bg-primary-foreground/20 px-2.5 py-1 rounded-md text-sm font-mono">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span className="bg-primary-foreground/20 px-2.5 py-1 rounded-md text-sm font-mono">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span className="bg-primary-foreground/20 px-2.5 py-1 rounded-md text-sm font-mono">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Pricing Card */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-primary/20 shadow-elevated hover:shadow-float transition-all duration-300">
              <CardHeader className="text-center pb-8 border-b">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-ai-primary rounded-2xl mx-auto mb-4 shadow-float">
                  <Brain className="w-8 h-8 text-white" />
                </div>

                <CardTitle className="text-3xl mb-3">AI Premium Access</CardTitle>
                <CardDescription className="text-base">Lifetime access to all AI-powered features</CardDescription>

                <div className="flex items-end justify-center gap-2 mt-6">
                  <span className="text-2xl text-muted-foreground line-through">₹999</span>
                  <span className="text-6xl font-bold bg-gradient-ai-primary bg-clip-text text-transparent">₹499</span>
                </div>

                <Badge variant="secondary" className="mt-4 text-sm px-4 py-1.5">
                  Save ₹500 Today
                </Badge>
              </CardHeader>

              <CardContent className="pt-8">
                {/* Features Grid */}
                <div className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-light/50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-ai-primary rounded-lg flex items-center justify-center shadow-card group-hover:shadow-elevated transition-shadow">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-foreground font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  size="lg"
                  className="w-full py-6 text-lg font-semibold bg-gradient-ai-primary hover:shadow-float transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Get Premium Access
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Instant Access
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    24/7 Support
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Proof Sidebar */}
          <div className="space-y-6">
            {/* Rating Card */}
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-3xl font-bold mb-1">4.9/5</p>
                  <p className="text-sm text-muted-foreground">From 10,000+ reviews</p>
                </div>
                <div className="pt-4 border-t text-center">
                  <p className="text-2xl font-bold text-primary mb-1">50,000+</p>
                  <p className="text-sm text-muted-foreground">Successful Students</p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{testimonial.image}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-primary">{testimonial.achievement}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-sm text-muted-foreground">
            🔒 Secure payment powered by Razorpay • 256-bit SSL encryption
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">🏆 Best AI Learning Platform 2024</span>
            <span className="flex items-center gap-1">🛡️ ISO 27001 Certified</span>
            <span className="flex items-center gap-1">⚡ 99.9% Uptime Guarantee</span>
            <span className="flex items-center gap-1">💯 30-Day Money Back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
