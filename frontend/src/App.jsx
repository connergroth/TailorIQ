import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import TailorIQLandingPage from './landingPage';
import QuestionnaireSection from './components/questionnaire';
import Auth from './components/Auth';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useUser();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser } = useUser();
  
  // Check for user's preferred color scheme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Listen for changes in user preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
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
  
  const handleFormSubmit = () => {
    // Add form submission logic here
    alert("Resume generated! This would typically generate and display a resume.");
  };
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<TailorIQLandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} isLoggedIn={!!currentUser} />} 
        />
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/questionnaire" replace /> : <Auth darkMode={darkMode} />} 
        />
        <Route 
          path="/questionnaire" 
          element={
            <ProtectedRoute>
              <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <QuestionnaireSection darkMode={darkMode} onSubmit={handleFormSubmit} toggleDarkMode={toggleDarkMode} />
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;