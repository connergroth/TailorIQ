import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import TailorIQLandingPage from './landingPage';
import QuestionnairePage from './questionnairePage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on user preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);

    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AuthProvider>
      <div className={`${darkMode ? 'dark' : ''}`}>
        <Router>
          <Routes>
            {/* Public Auth route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Landing page */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TailorIQLandingPage
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </PrivateRoute>
              }
            />

            {/* Protected Questionnaire */}
            <Route
              path="/questionnaire"
              element={
                <PrivateRoute>
                  <QuestionnairePage darkMode={darkMode} />
                </PrivateRoute>
              }
            />

            {/* Catch-all redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
