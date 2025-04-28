import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "./contexts/UserContext";
import NotFound from "@/pages/not-found";
import ResumeMaker from "@/pages/ResumeMaker";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import ProtectedRoute from "@/components/ProtectedRoute";

function RouterContent() {
  const { currentUser, isDarkMode, toggleDarkMode } = useUser();
  const [location, setLocation] = useLocation();

  // Redirect to resume page if logged in and trying to access login page
  useEffect(() => {
    if (currentUser && location === '/login') {
      setLocation('/resume');
    }
  }, [currentUser, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={() => (
        <LandingPage darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      )} />
      <Route path="/login" component={() => (
        <AuthPage darkMode={isDarkMode} />
      )} />
      <Route path="/resume" component={() => (
        <ProtectedRoute>
          <ResumeMaker />
        </ProtectedRoute>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <RouterContent />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
