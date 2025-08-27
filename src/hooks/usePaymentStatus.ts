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
        setLoading(false);
        return;
      }

      try {
        // First check profile payment status for quick lookup
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('payment_status')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setLoading(false);
          return;
        }

        if (profile?.payment_status === 'completed' || profile?.payment_status === 'trial') {
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

        if (paymentError) {
          console.error('Error fetching payment:', paymentError);
          setLoading(false);
          return;
        }

        if (payment) {
          // Update profile if payment exists but profile wasn't updated
          await supabase
            .from('profiles')
            .update({ payment_status: 'completed' })
            .eq('user_id', user.id);
          
          setHasPaid(true);
          setPaymentStatus('completed');
        } else {
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