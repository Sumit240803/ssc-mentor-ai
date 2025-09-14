import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";

import Lectures from "./pages/Lectures";
import TopicDetail from "./pages/TopicDetail";
import AIChat from "./pages/AIChat";
import TopicSummary from "./pages/TopicSummary";
import MockTest from "./pages/MockTest";
import Schedule from "./pages/Schedule";
import Motivation from "./pages/Motivation";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LectureManagement from "./pages/admin/LectureManagement";
import SubjectManagement from "./pages/admin/SubjectManagement";
import TaskManagement from "./pages/admin/TaskManagement";
import MotivationManagement from "./pages/admin/MotivationManagement";
import PostModeration from "./pages/admin/PostModeration";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to conditionally render navbar
const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/auth'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
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
              path="/topic" 
              element={
                <ProtectedRoute>
                  <TopicDetail />
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
              path="/topic-summary" 
              element={
                <ProtectedRoute>
                  <TopicSummary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mock-test" 
              element={
                <ProtectedRoute>
                  <MockTest />
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
              path="/motivation" 
              element={
                <ProtectedRoute>
                  <Motivation />
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
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/lectures" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <LectureManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/lectures/create" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <LectureManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/subjects" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <SubjectManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/tasks" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <TaskManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/motivation" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <MotivationManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <PostModeration />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
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

export default App;