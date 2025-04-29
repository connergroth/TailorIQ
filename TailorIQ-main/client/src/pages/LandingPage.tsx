import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowRight, FileText, PenTool, Star, Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

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
      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-gray-800 transition-all duration-300">
        <span className="text-2xl font-bold gradient-text">
          T
        </span>
      </div>
      <h1 className="text-2xl font-bold">
        <span className="gradient-text">TailorIQ</span>
      </h1>
    </div>
  );
};

interface LandingPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  useEffect(() => {
    // Apply dark mode class to document for tailwind dark: variants
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [darkMode]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/resume');
    } else {
      navigate('/login');
    }
  };

  // Navbar Component
  const Navbar = () => {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 
        ${isScrolled ? 
          'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 
          'bg-transparent'}`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Logo darkMode={darkMode} />
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={(e) => smoothScroll(e, 'features')} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Features</a>
            <a href="#how-it-works" onClick={(e) => smoothScroll(e, 'how-it-works')} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">How It Works</a>
            <a href="#why-tailoriq" onClick={(e) => smoothScroll(e, 'why-tailoriq')} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Why TailorIQ</a>
            {!currentUser && (
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }} 
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                Login
              </a>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode} 
              className="p-2.5 rounded-full transition-all duration-300 bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-yellow-400 hover:bg-indigo-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button 
              onClick={handleGetStarted}
              className="hidden md:block bg-gradient-to-r from-brand-indigo to-brand-purple text-white px-6 py-2 rounded-md hover:shadow-lg hover:from-brand-purple hover:to-brand-indigo transition-all duration-300 transform hover:scale-105"
            >
              {currentUser ? 'Go to Dashboard' : 'Start for Free'}
            </Button>
            
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
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-300 py-4 shadow-xl mobile-menu-transition"
          >
            <div className="container mx-auto px-4 space-y-4">
              <a href="#features" onClick={(e) => {
                smoothScroll(e, 'features');
                setMobileMenuOpen(false);
              }} className="block py-3 px-4 rounded-md hover:bg-gradient-to-r from-gray-100 dark:from-gray-800 to-gray-100 dark:to-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-300">Features</a>
              <a href="#how-it-works" onClick={(e) => {
                smoothScroll(e, 'how-it-works');
                setMobileMenuOpen(false);
              }} className="block py-3 px-4 rounded-md hover:bg-gradient-to-r from-gray-100 dark:from-gray-800 to-gray-100 dark:to-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-300">How It Works</a>
              <a href="#why-tailoriq" onClick={(e) => {
                smoothScroll(e, 'why-tailoriq');
                setMobileMenuOpen(false);
              }} className="block py-3 px-4 rounded-md hover:bg-gradient-to-r from-gray-100 dark:from-gray-800 to-gray-100 dark:to-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-300">Why TailorIQ</a>
              {!currentUser && (
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }} 
                  className="block py-3 px-4 rounded-md hover:bg-gradient-to-r from-gray-100 dark:from-gray-800 to-gray-100 dark:to-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Log In
                </a>
              )}
              <Button 
                onClick={() => {
                  handleGetStarted();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center bg-gradient-to-r from-brand-indigo to-brand-purple text-white py-3 rounded-md hover:shadow-lg transition-all duration-300 mt-2"
              >
                {currentUser ? 'Go to Dashboard' : 'Start for Free'}
              </Button>
            </div>
          </motion.div>
        )}
      </nav>
    );
  };

  // Hero Section
  const Hero = () => {
    return (
      <section 
        className="pt-32 pb-20 bg-white dark:bg-gray-900 bg-hero-pattern-light dark:bg-hero-pattern-dark text-gray-900 dark:text-white transition-colors duration-300"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col lg:flex-row items-center"
          >
            <motion.div 
              variants={slideInFromLeft}
              className="lg:w-1/2 mb-10 lg:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Create <span className="gradient-text">AI-powered</span> resumes tailored for your dream job
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                TailorIQ uses advanced AI to help you craft professional resumes optimized for applicant tracking systems and hiring managers.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-purple hover:to-brand-indigo text-white px-8 py-6 rounded-md text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  <span>Start Creating</span> 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => smoothScroll(e, 'how-it-works')}
                  className="flex items-center justify-center px-8 py-6 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-lg group hover:shadow-md"
                >
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </a>
              </div>
            </motion.div>
            <motion.div 
              variants={slideInFromRight}
              className="lg:w-1/2 lg:pl-10"
            >
              <div className="glass-card rounded-xl overflow-hidden shadow-2xl border border-indigo-500/20">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-6"
                  variants={fadeInUp}
                >
                  <div className="space-y-6">
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center text-white text-2xl font-bold">
                      </div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-8 bg-gradient-to-r from-indigo-200 to-purple-100 rounded-md shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-indigo-100 to-purple-50 rounded-md w-3/4 shimmer"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gradient-to-r from-indigo-100 to-purple-50 rounded-md shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-indigo-100 to-purple-50 rounded-md w-5/6 shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-indigo-100 to-purple-50 rounded-md w-3/4 shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-indigo-100 to-purple-50 rounded-md shimmer"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-gradient-to-br from-indigo-200 to-purple-100 rounded-md shimmer"></div>
                      <div className="h-24 bg-gradient-to-br from-indigo-200 to-purple-100 rounded-md shimmer"></div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <div className="h-10 w-24 bg-brand-indigo rounded-md shimmer"></div>
                      <div className="h-10 w-24 bg-brand-purple rounded-md shimmer"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
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
        icon: <FileText className="h-8 w-8 text-white" />
      },
      {
        title: "AI Content Assistance",
        description: "Get smart suggestions to improve your resume content based on industry standards.",
        icon: <PenTool className="h-8 w-8 text-white" />
      },
      {
        title: "ATS Optimization",
        description: "Ensure your resume passes through Applicant Tracking Systems with our optimization tools.",
        icon: <Search className="h-8 w-8 text-white" />
      },
      {
        title: "Industry-Specific Advice",
        description: "Receive tailored recommendations based on your target industry and role.",
        icon: <Star className="h-8 w-8 text-white" />
      }
    ];

    return (
      <section 
        id="features" 
        className="py-20 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
              Our platform provides everything you need to create a professional, effective resume that gets results.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="group"
              >
                <div className="relative h-full overflow-hidden rounded-xl transition-all duration-300 transform group-hover:translate-y-[-5px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo to-brand-purple opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8 z-10 flex flex-col h-full">
                    <div className="mb-4 p-3 bg-white/20 rounded-lg w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white/90">{feature.description}</p>
                    <div className="mt-auto pt-4">
                      <div className="inline-flex items-center text-white">
                        <span className="mr-2 font-medium">Learn more</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
      <section 
        id="how-it-works" 
        className="py-24 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
              Creating a professional resume has never been easier. Follow these steps to get started.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="relative"
              >
                <div className="text-7xl font-bold text-indigo-100 dark:text-brand-indigo dark:opacity-20 absolute -top-10 left-0">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-20 text-center"
          >
            <Button
              onClick={() => {
                const navigate = useNavigate();
                const { currentUser } = useUser();
                if (currentUser) {
                  navigate('/resume');
                } else {
                  navigate('/login');
                }
              }}
              className="bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-purple hover:to-brand-indigo text-white px-10 py-6 rounded-md text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    );
  };

  // Why TailorIQ Section
  const WhyTailorIQ = () => {
    return (
      <section 
        id="why-tailoriq" 
        className="py-24 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TailorIQ</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
              Stand out from the competition with our cutting-edge resume creation platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInFromLeft}
              className="order-2 md:order-1"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">The TailorIQ Advantage</h3>
              <div className="space-y-6">
                {[
                  "Advanced AI technology that understands what employers are looking for",
                  "Professionally designed templates that highlight your strengths",
                  "Real-time feedback and suggestions to improve your content",
                  "ATS optimization to ensure your resume passes through automated filters"
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    custom={index}
                    className="flex items-start"
                  >
                    <div className="mt-1 mr-4 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg text-gray-800 dark:text-gray-200">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInFromRight}
              className="order-1 md:order-2"
            >
              <div className="glass-card p-8 rounded-xl shadow-2xl relative overflow-hidden border-t border-white/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-indigo/20 to-brand-purple/20 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-brand-indigo/20 to-brand-purple/20 blur-2xl rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="mb-6 text-center relative z-10">
                  <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-brand-purple to-brand-indigo text-white">
                    What Users Say
                  </span>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <blockquote className="text-lg md:text-xl italic mb-6 text-gray-800 dark:text-gray-200">
                    "TailorIQ completely transformed my job search. I received more callbacks in one week than I had in months with my old resume."
                  </blockquote>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple flex items-center justify-center text-white font-semibold">RH</div>
                    <div className="ml-4">
                      <div className="font-bold text-lg text-gray-900 dark:text-white">Ronan Healy</div>
                      <div className="text-gray-600 dark:text-gray-400">Software Engineer</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">5.0 rating</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  // Footer Component
  const Footer = () => {
    const year = new Date().getFullYear();
    
    return (
      <footer className="py-16 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="mb-6 md:mb-0">
              <Logo darkMode={darkMode} />
              <p className="mt-2">Creating professional resumes with AI assistance</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-4 text-center md:text-left">
              <a href="#features" onClick={(e) => smoothScroll(e, 'features')} className="hover:text-brand-indigo dark:hover:text-indigo-400 transition-colors duration-300">Features</a>
              <a href="#how-it-works" onClick={(e) => smoothScroll(e, 'how-it-works')} className="hover:text-brand-indigo dark:hover:text-indigo-400 transition-colors duration-300">How It Works</a>
              <a href="#why-tailoriq" onClick={(e) => smoothScroll(e, 'why-tailoriq')} className="hover:text-brand-indigo dark:hover:text-indigo-400 transition-colors duration-300">Why TailorIQ</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {year} TailorIQ. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  // Back to top button
  const BackToTop = () => {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      };
      
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.5,
          y: visible ? 0 : 20
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 rounded-full z-50 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <WhyTailorIQ />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default LandingPage;