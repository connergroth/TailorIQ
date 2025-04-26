import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Edit, FileText, FolderOpen, Moon, PenTool, Rocket, Search, Star, Sun } from 'lucide-react';
import { useUser } from './contexts/UserContext';

// Smooth scroll function
const smoothScroll = (e, targetId) => {
  e.preventDefault();
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 80, // Offset for navbar height
      behavior: 'smooth'
    });
  }
};

// Logo Component
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

// Navbar Component
const Navbar = ({ darkMode, toggleDarkMode, handleGetStarted, isAuthenticated }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogin = () => {
    // For now, this will just redirect to the questionnaire if already authenticated
    // Later, this would open a login modal or redirect to a login page
    if (isAuthenticated) {
      navigate('/questionnaire');
    } else {
      // Authentication handling would go here in the future
      handleGetStarted();
    }
  };

  return (
    <nav className={`sticky top-0 z-50 shadow-sm py-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <Logo darkMode={darkMode} />
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" onClick={(e) => smoothScroll(e, 'features')} className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}>Features</a>
          <a href="#how-it-works" onClick={(e) => smoothScroll(e, 'how-it-works')} className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}>How It Works</a>
          <a href="#why-tailoriq" onClick={(e) => smoothScroll(e, 'why-tailoriq')} className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}>Why TailorIQ</a>
          <a href="#login" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}>Log In</a>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode} 
            className={`p-2.5 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} transition-all duration-300`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button 
            onClick={handleGetStarted}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300 hidden md:block"
          >
            Start for Free
          </button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-500 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pt-2 pb-4 space-y-3 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
          <a href="#features" onClick={(e) => { smoothScroll(e, 'features'); toggleMobileMenu(); }} className={`block py-2 ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}>Features</a>
          <a href="#how-it-works" onClick={(e) => { smoothScroll(e, 'how-it-works'); toggleMobileMenu(); }} className={`block py-2 ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}>How It Works</a>
          <a href="#why-tailoriq" onClick={(e) => { smoothScroll(e, 'why-tailoriq'); toggleMobileMenu(); }} className={`block py-2 ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}>Why TailorIQ</a>
          <a href="#pricing" className={`block py-2 ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}>Pricing</a>
          <button 
            onClick={handleLogin}
            className={`block py-2 ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}`}
          >
            {isAuthenticated ? 'Dashboard' : 'Log In'}
          </button>
          <button 
            onClick={handleGetStarted}
            className="w-full mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Start for Free
          </button>
        </div>
      )}
    </nav>
  );
};

// Hero Section Component with Start button functionality
const HeroSection = ({ darkMode, handleGetStarted }) => {
  return (
    <section className={`py-20 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 to-white'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 flex flex-col items-center md:items-start">
            <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 text-center md:text-left`}>
              TailorIQ: Instantly Generate Recruiter-Ready Resumes with AI
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 text-center md:text-left`}>
              Input your experience, add a job description if you want — TailorIQ crafts a role-optimized, ATS-friendly resume in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full">
              <button 
                onClick={handleGetStarted}
                className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-all duration-300 text-lg font-medium w-full sm:w-auto"
              >
                Start for Free
              </button>
              <a 
                href="#how-it-works" 
                onClick={(e) => smoothScroll(e, 'how-it-works')}
                className={`flex items-center justify-center ${darkMode ? 'bg-gray-800 text-indigo-400 border border-indigo-500 hover:bg-gray-700' : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'} px-8 py-3 rounded-md transition-all duration-300 text-lg font-medium w-full sm:w-auto`}
              >
                See How It Works <ChevronDown className="ml-2 h-5 w-5" />
              </a>
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-6 italic text-center md:text-left w-full`}>
              "Since AI already parses resumes, why not let AI optimize yours?"
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl w-full max-w-md transition-colors duration-300`}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} p-3 rounded-full mr-4 transition-colors duration-300`}>
                    <FileText className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Enter experience</p>
                  </div>
                  <ArrowRight className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-300`} />
                </div>
                <div className="flex items-center">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} p-3 rounded-full mr-4 transition-colors duration-300`}>
                    <Search className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Upload job description</p>
                  </div>
                  <ArrowRight className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-300`} />
                </div>
                <div className="flex items-center">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} p-3 rounded-full mr-4 transition-colors duration-300`}>
                    <Star className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Get tailored resume</p>
                  </div>
                  <ArrowRight className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-300`} />
                </div>
                <div className="flex items-center">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} p-3 rounded-full mr-4 transition-colors duration-300`}>
                    <Edit className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Edit and save</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start">
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} p-3 rounded-full mr-4 transition-colors duration-300`}>
          {React.cloneElement(icon, { className: `h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300` })}
        </div>
        <div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>{title}</h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = ({ darkMode }) => {
  const features = [
    {
      icon: <Rocket />,
      title: "Streamlined Resume Generation",
      description: "Users quickly input basic experience and skills. TailorIQ builds a clean, ATS-friendly resume using a professional LaTeX template."
    },
    {
      icon: <Search />,
      title: "Role-Specific Optimization",
      description: "Paste a job description — TailorIQ rewrites bullets and skills to match that role's keywords and language."
    },
    {
      icon: <Star />,
      title: "Actionable AI Insights",
      description: "GPT explains why specific skills, action verbs, and bullet points were emphasized, offering suggestions for improvement."
    },
    {
      icon: <Edit />,
      title: "Post-Generation Revision",
      description: "Edit sections manually or ask AI to regenerate specific parts of your resume for better alignment."
    },
    {
      icon: <FolderOpen />,
      title: "Resume History Management",
      description: "Save, name, and revisit past resumes to manage multiple targeted applications easily."
    }
  ];

  return (
    <section id="features" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Step Component
const Step = ({ number, title, description, icon, darkMode }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${darkMode ? 'bg-indigo-500' : 'bg-indigo-600'} text-white font-bold text-xl mb-4 transition-colors duration-300`}>
        {number}
      </div>
      <div className="flex items-center justify-center mb-3">
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} p-2 rounded-full mr-3 transition-colors duration-300`}>
          {React.cloneElement(icon, { className: `h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300` })}
        </div>
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{title}</h3>
      </div>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} px-4 transition-colors duration-300`}>{description}</p>
    </div>
  );
};

// How It Works Section Component
const HowItWorksSection = ({ darkMode }) => {
  const steps = [
    {
      number: 1,
      icon: <PenTool />,
      title: "Input Experience",
      description: "Basic details: Work history, skills, education."
    },
    {
      number: 2,
      icon: <Search />,
      title: "Add (Optional) Job Description",
      description: "TailorIQ will fine-tune your resume to match keywords and priorities."
    },
    {
      number: 3,
      icon: <Rocket />,
      title: "Generate Tailored Resume",
      description: "Instant PDF with role-specific emphasis, using clean LaTeX formatting."
    },
    {
      number: 4,
      icon: <FolderOpen />,
      title: "Revise and Save",
      description: "Edit with AI help, save multiple versions, track your applications."
    }
  ];

  return (
    <section id="how-it-works" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>How TailorIQ Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              number={step.number} 
              icon={step.icon} 
              title={step.title} 
              description={step.description} 
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Why TailorIQ Section Component
const WhyTailorIQSection = ({ darkMode }) => {
  const reasons = [
    "Instantly generate recruiter-optimized resumes",
    "Tailor each resume for specific job descriptions",
    "Edit and revise with smart AI guidance",
    "Manage all your resumes in one place",
    "Understand the why behind every suggestion"
  ];

  return (
    <section id="why-tailoriq" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>Why Choose TailorIQ?</h2>
        <div className="max-w-3xl mx-auto">
          <ul className="space-y-3 mb-8">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`ml-3 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>{reason}</span>
              </li>
            ))}
          </ul>
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-700'} italic transition-colors duration-300`}>
            "Get better results, with less rewriting."
          </p>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = ({ darkMode }) => {
  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-800 text-white'} py-12 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo darkMode={darkMode} />
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-300'} max-w-md mt-3`}>
              TailorIQ makes professional, optimized resumes accessible to everyone — in seconds.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>Terms of Service</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>Privacy Policy</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>Contact Us</a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TailorIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const TailorIQLandingPage = ({ darkMode, toggleDarkMode, isLoggedIn }) => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const handleGetStarted = () => {
    // Navigate directly to the login page for Google authentication
    navigate('/login');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        handleGetStarted={handleGetStarted}
        isLoggedIn={!!currentUser}
      />
      <HeroSection darkMode={darkMode} handleGetStarted={handleGetStarted} />
      <FeaturesSection darkMode={darkMode} />
      <HowItWorksSection darkMode={darkMode} />
      <WhyTailorIQSection darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default TailorIQLandingPage;