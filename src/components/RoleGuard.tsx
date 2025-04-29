
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';

type RoleGuardProps = {
  children: ReactNode;
  requiredRole: 'admin' | 'user';
  fallbackPath?: string;
};

const RoleGuard = ({ children, requiredRole, fallbackPath = '/' }: RoleGuardProps) => {
  const { role, isLoading } = useRole();
  const { toast } = useToast();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-smartbus-blue"></div>
      </div>
    );
  }
  
  // Allow access if:
  // 1. User is admin (admins can access everything)
  // 2. Required role is 'user' and the user has any role
  const hasAccess = role === 'admin' || (requiredRole === 'user' && role === 'user');
  
  if (!hasAccess) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    
    return <Navigate to={fallbackPath} />;
  }
  
  return <>{children}</>;
};

export default RoleGuard;
