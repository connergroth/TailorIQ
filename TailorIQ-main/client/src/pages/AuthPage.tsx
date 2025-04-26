import React from 'react';
import Auth from '@/components/Auth';

interface AuthPageProps {
  darkMode: boolean;
}

export default function AuthPage({ darkMode }: AuthPageProps) {
  return <Auth darkMode={darkMode} />;
}