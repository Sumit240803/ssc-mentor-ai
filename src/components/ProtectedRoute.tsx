import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePayment?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requirePayment = true }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasPaid, loading: paymentLoading } = usePaymentStatus();
  const location = useLocation();

  if (authLoading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If payment is required and user hasn't paid, redirect to pricing
  if (requirePayment && !hasPaid) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;