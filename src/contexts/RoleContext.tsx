
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Role = 'user' | 'admin';

type RoleContextType = {
  role: Role;
  isAdmin: boolean;
  isLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<Role>('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole('user');
        setIsLoading(false);
        return;
      }

      try {
        // In a real scenario, you would fetch this from a users_roles table
        // For demo, we're checking if the user's email contains 'admin'
        // If you have a users_roles table:
        // const { data, error } = await supabase
        //   .from('users_roles')
        //   .select('role')
        //   .eq('user_id', user.id)
        //   .single();
        
        const isUserAdmin = user.email?.includes('admin') || false;
        setRole(isUserAdmin ? 'admin' : 'user');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user'); // Default to lowest privilege
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const value: RoleContextType = {
    role,
    isAdmin: role === 'admin',
    isLoading,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
