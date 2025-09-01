import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatus {
  hasPaid: boolean;
  loading: boolean;
  paymentStatus: 'pending' | 'completed' | 'trial';
}

export const usePaymentStatus = (): PaymentStatus => {
  const { user } = useAuth();
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'trial'>('pending');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) {
        console.log('No user found, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        console.log('Checking payment status for user:', user.id, 'User email:', user.email);
        
        // First check profile payment status for quick lookup
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('payment_status')
          .eq('user_id', user.id)
          .single();

        console.log('Profile data:', profile, 'Profile error:', profileError);

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Don't return here, continue to check payments table
        } else if (profile?.payment_status === 'completed' || profile?.payment_status === 'trial') {
          console.log('User has paid according to profile');
          setHasPaid(true);
          setPaymentStatus(profile.payment_status);
          setLoading(false);
          return;
        }

        // Double-check with payments table
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .limit(1)
          .maybeSingle();

        console.log('Payment data:', payment, 'Payment error:', paymentError);

        if (paymentError) {
          console.error('Error fetching payment:', paymentError);
          setLoading(false);
          return;
        }

        if (payment) {
          console.log('Found completed payment, updating profile...');
          // Update profile if payment exists but profile wasn't updated
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ payment_status: 'completed' })
            .eq('user_id', user.id);
          
          if (updateError) {
            console.error('Error updating profile:', updateError);
          } else {
            console.log('Profile updated successfully');
          }
          
          setHasPaid(true);
          setPaymentStatus('completed');
        } else {
          console.log('No completed payments found');
          setHasPaid(false);
          const status = profile?.payment_status;
          if (status === 'pending' || status === 'completed' || status === 'trial') {
            setPaymentStatus(status);
          } else {
            setPaymentStatus('pending');
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [user]);

  return { hasPaid, loading, paymentStatus };
};