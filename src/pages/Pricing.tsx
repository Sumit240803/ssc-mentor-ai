import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, BookOpen, Video, Users, Award } from 'lucide-react';
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
        throw paymentError;
      }

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_your_key_here', // Replace with your actual Razorpay key
        amount: 49900, // 499 rupees in paise
        currency: 'INR',
        name: 'EduPlatform',
        description: 'Premium Course Access',
        order_id: paymentData.id,
        handler: async function (response: any) {
          try {
            // Update payment record with Razorpay details
            const { error: updateError } = await supabase
              .from('payments')
              .update({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
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

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', async function (response: any) {
        // Update payment status to failed
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            razorpay_payment_id: response.error.metadata.payment_id
          })
          .eq('id', paymentData.id);

        toast({
          title: "Payment Failed",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
      });

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
    { icon: BookOpen, text: "Access to all premium courses" },
    { icon: Video, text: "High-quality video lectures" },
    { icon: Users, text: "Live interactive sessions" },
    { icon: Award, text: "Course completion certificates" },
    { icon: Check, text: "Lifetime access to content" },
    { icon: Check, text: "Download materials for offline study" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Unlock Your Learning Potential
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Join thousands of students already learning with EduPlatform
          </p>
          <Badge variant="secondary" className="text-sm">
            🚀 Limited Time Offer
          </Badge>
        </div>

        {/* Main Pricing Card */}
        <Card className="shadow-elevated border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-primary mr-2" />
              <CardTitle className="text-2xl">Premium Access</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Get unlimited access to all our premium educational content
            </CardDescription>
            
            <div className="flex items-center justify-center mt-6">
              <span className="text-4xl font-bold text-primary">₹499</span>
              <span className="text-muted-foreground ml-2">/lifetime</span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              One-time payment • No recurring charges
            </p>
          </CardHeader>

          <CardContent>
            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Button 
                onClick={handlePayment}
                disabled={loading}
                size="lg"
                className="w-full md:w-auto px-12 py-6 text-lg font-semibold"
                variant="default"
              >
                {loading ? "Processing..." : "Unlock Premium Access - ₹499"}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Secure payment powered by Razorpay • 100% safe & encrypted
              </p>
              
              <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-muted-foreground">
                <span>✓ Instant access</span>
                <span>✓ 30-day money back</span>
                <span>✓ Customer support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by 10,000+ students worldwide
          </p>
          <div className="flex justify-center space-x-8 opacity-60">
            <span className="text-xs">🔒 SSL Secured</span>
            <span className="text-xs">💳 Multiple Payment Options</span>
            <span className="text-xs">📱 Mobile Friendly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;