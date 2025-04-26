import { useState, useEffect } from "react";
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
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser } = useUser();
  const [location, setLocation] = useLocation();
  
  // Check for user's preferred color scheme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Listen for changes in user preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Redirect to resume page if logged in and trying to access login page
  useEffect(() => {
    if (currentUser && location === '/login') {
      setLocation('/resume');
    }
  }, [currentUser, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={() => (
        <LandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )} />
      <Route path="/login" component={() => (
        <AuthPage darkMode={darkMode} />
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
  return <AppContent />;
}

export default App;
