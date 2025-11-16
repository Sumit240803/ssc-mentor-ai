import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { initializeAnalytics, trackPageView } from "./lib/analytics";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import FreeGlobalTest from "./pages/FreeGlobalTest";

import Lectures from "./pages/Lectures";
import LectureDetail from "./pages/LectureDetail";
import AIChat from "./pages/AIChat";
import MockTestsList from "./pages/MockTestsList";
import MockTest from "./pages/MockTest";
import MockTestAnalysis from "./pages/MockTestAnalysis";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import PhysicalEducation from "./pages/PhysicalEducation";
import Contact from "./pages/Contact";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to conditionally protect mock test routes
const MockTestWrapper = () => {
  const { testId } = useParams<{ testId: string }>();
  
  // Allow free access to Mock Test 1 but still require authentication
  if (testId === 'Complete_mock-test_1') {
    return (
      <ProtectedRoute requirePayment={false}>
        <MockTest />
      </ProtectedRoute>
    );
  }
  
  // Require authentication and payment for other tests
  return (
    <ProtectedRoute>
      <MockTest />
    </ProtectedRoute>
  );
};

// Component to conditionally render navbar
const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/auth'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/free-mock-test" element={<FreeGlobalTest />} />
            <Route 
              path="/pricing" 
              element={
                <ProtectedRoute requirePayment={false}>
                  <Pricing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lectures" 
              element={
                <ProtectedRoute>
                  <Lectures />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lecture-detail" 
              element={
                <ProtectedRoute>
                  <LectureDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-chat" 
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mock-tests" 
              element={
                <ProtectedRoute>
                  <MockTestsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mock-test/:testId" 
              element={<MockTestWrapper />} 
            />
            <Route 
              path="/mock-test-analysis/:testName" 
              element={
                <ProtectedRoute>
                  <MockTestAnalysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/physical-education" 
              element={
                <ProtectedRoute>
                  <PhysicalEducation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contact" 
              element={<Contact />} 
            />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="learnssc-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;