
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, SchoolDepartment, AuthState } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkUserPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Default auth state
const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: async () => {},
  logout: () => {},
  checkUserPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    const storedUser = localStorage.getItem('haca_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('haca_user');
        setAuthState({ ...defaultAuthState, isLoading: false });
      }
    } else {
      setAuthState({ ...defaultAuthState, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Query the haca_users table to find matching user
      const { data, error } = await supabase
        .from('haca_users')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .single();
      
      if (error) throw new Error('Invalid credentials');
      if (!data) throw new Error('User not found');
      
      // Verify password (in a real app, you'd use bcrypt or similar)
      if (data.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      // Transform the data into our User type
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        department: data.department as SchoolDepartment | undefined,
        avatar: data.avatar,
      };
      
      localStorage.setItem('haca_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('haca_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const checkUserPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!authState.user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(authState.user.role);
    }
    
    // Master admin has access to everything
    if (authState.user.role === UserRole.MASTER_ADMIN) return true;
    
    return authState.user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkUserPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
