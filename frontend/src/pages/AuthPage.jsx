// src/pages/AuthPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';           
import { signInWithGoogle } from '../firebase';

export default function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // if we already have a user, send them home
    if (user) {
      navigate('/', { replace: true });
    } else {
      // otherwise kick off Google popup
      signInWithGoogle().catch(console.error);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="mb-4 text-lg text-gray-700 dark:text-gray-200">
        Redirecting to Google…
      </p>
      <button
        onClick={() => signInWithGoogle()}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}
