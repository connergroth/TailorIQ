import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionnaireSection from './components/questionnaire';
import { ArrowLeft, Moon, Sun } from 'lucide-react';

const Logo = ({ darkMode }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 flex items-center justify-center">
        <img src="/assets/logo.png" alt="TailorIQ Logo" className="max-h-full" />
      </div>
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>TailorIQ</h1>
    </div>
  );
};

const QuestionnairePage = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Simple navbar with back button */}
      <nav className={`sticky top-0 z-50 shadow-sm py-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <button 
              onClick={goBack}
              className={`mr-4 ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Logo darkMode={darkMode} />
          </div>
          
          <button 
            onClick={toggleDarkMode} 
            className={`p-2.5 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} transition-all duration-300`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Main content - questionnaire */}
      <QuestionnaireSection darkMode={darkMode} />
    </div>
  );
};

export default QuestionnairePage;