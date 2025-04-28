
import { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  // Check for user preference on component mount
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return <LandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
};

export default Index;