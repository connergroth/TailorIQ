import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Moon, Sun, ArrowRight, FileText, PenTool, Star, Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from '@/components/ui/button';

// Smooth scroll function
const smoothScroll = (e: React.MouseEvent, targetId: string) => {
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
const Logo = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-lg text-white font-bold text-lg">
        TIQ
      </div>
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>TailorIQ</h1>
    </div>
  );
};

interface LandingPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [_, setLocation] = useLocation();
  const { currentUser } = useUser();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleGetStarted = () => {
    if (currentUser) {
      setLocation('/resume');
    } else {
      setLocation('/login');
    }
  };

  // Navbar Component
  const Navbar = () => {
    return (
      <nav className={`sticky top-0 z-50 shadow-sm py-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <div className="container mx-auto flex items-center justify-between px-4">
          <Logo darkMode={darkMode} />
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={(e) => smoothScroll(e, 'features')} className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}>Features</a>
            <a href="#how-it-works" onClick={(e) => smoothScroll(e, 'how-it-works')} className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}>How It Works</a>
            <a href="#why-tailoriq" onClick={(e) => smoothScroll(e, 'why-tailoriq')} className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}>Why TailorIQ</a>
            {!currentUser && (
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setLocation('/login');
                }} 
                className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}
              >
                Log In
              </a>
            )}
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
              {currentUser ? 'Go to Dashboard' : 'Start for Free'}
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-500 focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300 py-2`}>
            <div className="container mx-auto px-4 space-y-2">
              <a href="#features" onClick={(e) => {
                smoothScroll(e, 'features');
                setMobileMenuOpen(false);
              }} className={`block py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Features</a>
              <a href="#how-it-works" onClick={(e) => {
                smoothScroll(e, 'how-it-works');
                setMobileMenuOpen(false);
              }} className={`block py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>How It Works</a>
              <a href="#why-tailoriq" onClick={(e) => {
                smoothScroll(e, 'why-tailoriq');
                setMobileMenuOpen(false);
              }} className={`block py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Why TailorIQ</a>
              {!currentUser && (
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation('/login');
                    setMobileMenuOpen(false);
                  }} 
                  className={`block py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}
                >
                  Log In
                </a>
              )}
              <button 
                onClick={() => {
                  handleGetStarted();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all duration-300 mt-2"
              >
                {currentUser ? 'Go to Dashboard' : 'Start for Free'}
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  };

  // Hero Section
  const Hero = () => {
    return (
      <section className={`py-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Create <span className="text-indigo-600">AI-powered</span> resumes tailored for your dream job
            </h1>
            <p className="text-lg mb-8 opacity-90">
              TailorIQ uses advanced AI to help you craft professional resumes optimized for applicant tracking systems and hiring managers.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={handleGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg"
              >
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <a 
                href="#how-it-works" 
                onClick={(e) => smoothScroll(e, 'how-it-works')}
                className={`flex items-center justify-center px-8 py-3 rounded-md border ${
                  darkMode 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                } transition-colors duration-300 text-lg`}
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-10">
            <div className={`rounded-lg shadow-xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center`}>
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <div className="animate-pulse space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-20 h-20 rounded-full bg-indigo-200"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                      <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                      <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-indigo-200 rounded"></div>
                    <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                    <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                    <div className="h-4 bg-indigo-200 rounded w-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-indigo-200 rounded"></div>
                    <div className="h-24 bg-indigo-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Features Section
  const Features = () => {
    const features = [
      {
        title: "Professional Templates",
        description: "Choose from a variety of professionally designed templates that stand out to employers.",
        icon: <FileText className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "AI Content Assistance",
        description: "Get smart suggestions to improve your resume content based on industry standards.",
        icon: <PenTool className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "ATS Optimization",
        description: "Ensure your resume passes through Applicant Tracking Systems with our optimization tools.",
        icon: <Search className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Industry-Specific Advice",
        description: "Receive tailored recommendations based on your target industry and role.",
        icon: <Star className="h-6 w-6 text-indigo-400" />
      }
    ];

    return (
      <section id="features" className={`py-20 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our platform provides everything you need to create a professional, effective resume that gets results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} transition-colors duration-300 shadow-md`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // How It Works Section
  const HowItWorks = () => {
    const steps = [
      {
        number: "01",
        title: "Sign Up",
        description: "Create an account or sign in as a guest to get started immediately."
      },
      {
        number: "02",
        title: "Enter Your Information",
        description: "Input your experience, skills, and education in our user-friendly form."
      },
      {
        number: "03",
        title: "Get AI Assistance",
        description: "Our AI will suggest improvements to make your resume more impactful."
      },
      {
        number: "04",
        title: "Export and Apply",
        description: "Download your polished resume as a PDF and start applying to jobs."
      }
    ];

    return (
      <section id="how-it-works" className={`py-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Creating a professional resume has never been easier. Follow these steps to get started.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`text-5xl font-bold mb-4 ${darkMode ? 'text-indigo-500 opacity-50' : 'text-indigo-200'}`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 transform -translate-x-10">
                    <div className={`h-full w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button
              onClick={handleGetStarted}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-md text-lg"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    );
  };

  // Why TailorIQ Section
  const WhyTailorIQ = () => {
    return (
      <section id="why-tailoriq" className={`py-20 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose TailorIQ</h2>
            <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Stand out from the competition with our cutting-edge resume creation platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">The TailorIQ Advantage</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Advanced AI technology that understands what employers are looking for</p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Professionally designed templates that highlight your strengths</p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Real-time feedback and suggestions to improve your content</p>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>ATS optimization to ensure your resume passes through automated filters</p>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="mb-4 text-center">
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}>
                  What Users Say
                </span>
              </div>
              <blockquote className="italic mb-4">
                "TailorIQ completely transformed my job search. I received more callbacks in one week than I had in months with my old resume."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold">JS</span>
                </div>
                <div>
                  <div className="font-semibold">Jamie Smith</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Footer Component
  const Footer = () => {
    const year = new Date().getFullYear();
    
    return (
      <footer className={`py-10 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'} transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo darkMode={darkMode} />
              <p className="mt-2">Creating professional resumes with AI assistance</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <a href="#features" onClick={(e) => smoothScroll(e, 'features')} className="hover:underline">Features</a>
              <a href="#how-it-works" onClick={(e) => smoothScroll(e, 'how-it-works')} className="hover:underline">How It Works</a>
              <a href="#why-tailoriq" onClick={(e) => smoothScroll(e, 'why-tailoriq')} className="hover:underline">Why TailorIQ</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; {year} TailorIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <WhyTailorIQ />
      <Footer />
    </div>
  );
};

export default LandingPage;