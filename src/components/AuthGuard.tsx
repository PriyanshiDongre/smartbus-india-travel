
import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AuthGuardProps = {
  children: ReactNode;
  requireAuth?: boolean;
};

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate, requireAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartbus-blue"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
