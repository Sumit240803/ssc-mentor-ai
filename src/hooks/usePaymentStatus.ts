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
    if (authLoading) return;

    if (!user) {
      setHasPaid(false);
      setPaymentStatus('pending');
      setLoading(false);
      return;
    }

    const checkPayment = async () => {
      try {
        // Check profile first - this is the primary source of truth
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('payment_status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!profileError && profile) {
          if (profile.payment_status === 'completed' || profile.payment_status === 'trial') {
            setHasPaid(true);
            setPaymentStatus(profile.payment_status);
          } else {
            setHasPaid(false);
            setPaymentStatus('pending');
          }
        } else {
          // If no profile found or error, default to not paid
          setHasPaid(false);
          setPaymentStatus('pending');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error checking payment status:', err);
        setHasPaid(false);
        setPaymentStatus('pending');
        setLoading(false);
      }
    };

    checkPayment();
  }, [user, authLoading]);

  return { hasPaid, loading, paymentStatus };
};
