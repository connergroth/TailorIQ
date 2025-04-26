import React, { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '../contexts/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useUser();
  const [_, setLocation] = useLocation();
  
  React.useEffect(() => {
    if (!loading && !currentUser) {
      setLocation('/login');
    }
  }, [currentUser, loading, setLocation]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader animate-spin h-12 w-12 border-4 border-t-blue-500 border-blue-200 rounded-full"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return null; // Redirect happens in useEffect
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;