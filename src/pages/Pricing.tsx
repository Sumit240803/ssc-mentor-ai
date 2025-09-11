import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, BookOpen, Video, Users, Award, Brain, Zap, Target, Bot, Sparkles, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

  const handlePayment = async () => {
    console.log('Payment initiated');
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to continue",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating payment record...');
      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: 49900,
          currency: 'INR',
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        throw paymentError;
      }

      console.log('Payment record created:', paymentData);
      console.log('Razorpay available:', !!window.Razorpay);

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_RAQLUXcbIAyLns',
        amount: 49900, // 499 rupees in paise
        currency: 'INR',
        name: 'EduPlatform',
        description: 'Premium Course Access',
        // For test mode, we don't need to create a server-side order
        handler: async function (response: any) {
          try {
            // Update payment record with Razorpay details
            const { error: updateError } = await supabase
              .from('payments')
              .update({
                razorpay_payment_id: response.razorpay_payment_id,
                status: 'completed'
              })
              .eq('id', paymentData.id);

            if (updateError) {
              throw updateError;
            }

            // Update user profile payment status
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ payment_status: 'completed' })
              .eq('user_id', user.id);

            if (profileError) {
              throw profileError;
            }

            toast({
              title: "Payment Successful!",
              description: "Welcome to EduPlatform Premium! You now have access to all courses.",
            });

            navigate('/dashboard');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if money was deducted.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#3B82F6'
        }
      };

      console.log('Razorpay options:', options);
      const rzp = new window.Razorpay(options);
      console.log('Razorpay instance created:', rzp);
      
      rzp.on('payment.failed', async function (response: any) {
        console.log('Payment failed:', response);
        // Update payment status to failed
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            razorpay_payment_id: response.error.metadata?.payment_id || null
          })
          .eq('id', paymentData.id);

        toast({
          title: "Payment Failed",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
      });

      console.log('Opening Razorpay...');
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Brain, text: "AI-Powered Personalized Learning Paths", premium: true },
    { icon: Video, text: "Premium HD Video Lectures with AI Summaries", premium: true },
    { icon: Bot, text: "24/7 AI Mentor & Doubt Resolution", premium: true },
    { icon: Target, text: "AI-Driven Progress Analytics & Insights", premium: true },
    { icon: Zap, text: "Smart Practice Questions with AI Explanations", premium: true },
    { icon: Award, text: "AI-Verified Course Completion Certificates", premium: true },
    { icon: Users, text: "Live Interactive Sessions with AI Assistance", premium: true },
    { icon: Check, text: "Lifetime Access to All AI Features", premium: true },
    { icon: Check, text: "Download AI-Generated Study Materials", premium: true },
    { icon: CheckCircle, text: "Priority AI Support & Updates", premium: true },
  ];

  const testimonials = [
    {
      name: "Amit Sharma",
      achievement: "SSC CGL Cleared - Tier 1 & 2",
      text: "The AI mentor identified my weak areas and created a perfect study plan. The personalized approach made all the difference!",
      rating: 5,
      image: "👨‍💼"
    },
    {
      name: "Priya Patel", 
      achievement: "SSC CHSL Selected",
      text: "Amazing AI-powered practice questions and instant doubt resolution. The AI explanations were incredibly helpful.",
      rating: 5,
      image: "👩‍🎓"
    }
  ];

  // Countdown timer effect
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-glow rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-ai-secondary rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-32 h-32 bg-gradient-neural rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-semibold animate-pulse-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Learning Platform
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-neural bg-clip-text text-transparent">
              Unlock Your AI Learning
              <br />Potential
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Experience the future of SSC preparation with our advanced AI mentor that personalizes your learning journey
            </p>

            {/* Limited Time Offer */}
            <div className="bg-gradient-ai-primary text-white px-6 py-3 rounded-full inline-flex items-center space-x-2 mb-6 animate-pulse-glow">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Limited Time: 50% OFF</span>
              <div className="flex space-x-2 ml-4">
                <div className="bg-white/20 px-2 py-1 rounded text-sm">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </div>
                <div className="bg-white/20 px-2 py-1 rounded text-sm">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </div>
                <div className="bg-white/20 px-2 py-1 rounded text-sm">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>
          </div>

          {/* Main Pricing Card */}
          <Card className="shadow-floating border-0 bg-gradient-card backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
            
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-ai-primary rounded-2xl animate-pulse-glow">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2 bg-gradient-ai-secondary bg-clip-text text-transparent">
                AI Premium Access
              </CardTitle>
              <CardDescription className="text-lg mb-6">
                Get unlimited access to our cutting-edge AI-powered educational platform
              </CardDescription>
              
              <div className="flex items-center justify-center mb-4">
                <div className="text-right mr-4">
                  <div className="text-2xl text-muted-foreground line-through">₹999</div>
                  <div className="text-sm text-muted-foreground">Regular Price</div>
                </div>
                <div className="text-center">
                  <span className="text-5xl font-bold bg-gradient-ai-primary bg-clip-text text-transparent">₹499</span>
                  <span className="text-muted-foreground ml-2 text-lg">/lifetime</span>
                </div>
              </div>
              
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🚀 50% OFF • Limited Time Only
              </Badge>
            </CardHeader>

            <CardContent className="relative z-10">
              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                    <div className="p-1 bg-gradient-ai-primary rounded-lg">
                      <feature.icon className="w-4 h-4 text-white flex-shrink-0" />
                    </div>
                    <span className="text-foreground font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Join 50,000+ Successful Students</h3>
                  <div className="flex justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">4.9/5 from 10,000+ reviews</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-background rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{testimonial.image}</span>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-primary">{testimonial.achievement}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                  size="lg"
                  className="w-full py-6 text-xl font-bold bg-gradient-ai-primary hover:shadow-ai-glow transition-all duration-300 animate-pulse-glow mb-4"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Brain className="w-6 h-6 mr-2" />
                      Unlock AI Learning - ₹499
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </div>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground mb-4">
                  🔒 Secure payment powered by Razorpay • 256-bit SSL encryption
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-primary" />
                    Instant AI Access
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-primary" />
                    30-Day Guarantee
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-primary" />
                    24/7 AI Support
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by 50,000+ students • Featured in leading education portals
            </p>
            <div className="flex justify-center space-x-8 opacity-60 text-xs">
              <span>🏆 Best AI Learning Platform 2024</span>
              <span>🛡️ ISO 27001 Certified</span>
              <span>⚡ 99.9% Uptime Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;