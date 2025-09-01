import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatus {
  hasPaid: boolean;
  loading: boolean;
  paymentStatus: 'pending' | 'completed' | 'trial' | 'verifying';
}

export const usePaymentStatus = (): PaymentStatus => {
  const { user, loading: authLoading } = useAuth();
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'trial' | 'verifying'>('pending');

  useEffect(() => {
    if (authLoading) return; // wait for auth to finish

    if (!user) {
      setHasPaid(false);
      setPaymentStatus('pending');
      setLoading(false);
      return;
    }

    let isMounted = true;
    let retries = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 3000; // 3s

    const checkPayment = async () => {
      if (!isMounted) return;

      try {
        // Check profile first
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('payment_status')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        if (profile?.payment_status === 'completed' || profile?.payment_status === 'trial') {
          setHasPaid(true);
          setPaymentStatus(profile.payment_status);
          setLoading(false);
          return;
        }

        // If still pending, mark as verifying
        setPaymentStatus('verifying');

        // Check payments table
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .limit(1)
          .maybeSingle();

        if (paymentError) {
          console.error('Error fetching payment:', paymentError);
        }

        if (payment) {
          // Update profile if payment exists
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ payment_status: 'completed' })
            .eq('user_id', user.id);

          if (updateError) console.error('Error updating profile:', updateError);

          setHasPaid(true);
          setPaymentStatus('completed');
          setLoading(false);
        } else if (retries < MAX_RETRIES) {
          // Retry after delay
          retries++;
          setTimeout(checkPayment, RETRY_DELAY);
        } else {
          // Max retries reached → payment still not found
          setHasPaid(false);
          setPaymentStatus('pending');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        setHasPaid(false);
        setPaymentStatus('pending');
        setLoading(false);
      }
    };

    checkPayment();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  return { hasPaid, loading, paymentStatus };
};
