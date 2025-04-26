import React from 'react';
import { useLocation } from 'wouter';
import { signInWithGoogle, signInAsGuest } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AuthProps {
  darkMode: boolean;
}

const Auth: React.FC<AuthProps> = ({ darkMode }) => {
  const [_, setLocation] = useLocation();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Redirect to resume maker after successful login
        setLocation('/resume');
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      const user = await signInAsGuest();
      if (user) {
        // Redirect to resume maker after successful login
        setLocation('/resume');
      }
    } catch (error) {
      console.error("Guest authentication failed:", error);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300 p-4`}>
      <Card className={`w-full max-w-md shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white'}`}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to TailorIQ</CardTitle>
          <CardDescription className={`text-center ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            Create and manage your professional resumes with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className={`w-full ${darkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Sign in with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className={`w-full ${darkMode ? 'bg-slate-700' : ''}`} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500'}`}>
                Or continue with
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleGuestSignIn}
            variant="secondary"
            className={`w-full ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : ''}`}
          >
            Continue as Guest
          </Button>
        </CardContent>
        <CardFooter>
          <p className={`text-xs text-center w-full ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            By signing in, you agree to our <a href="#" className="underline hover:text-slate-900 dark:hover:text-slate-100">Terms of Service</a> and <a href="#" className="underline hover:text-slate-900 dark:hover:text-slate-100">Privacy Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;