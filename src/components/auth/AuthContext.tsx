
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, SchoolDepartment, AuthState } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkUserPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@haca.academy',
    role: UserRole.MASTER_ADMIN,
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0159FF&color=fff',
  },
  {
    id: '2',
    name: 'Sales User',
    email: 'sales@haca.academy',
    role: UserRole.SALES_EXECUTIVE,
    avatar: 'https://ui-avatars.com/api/?name=Sales+User&background=0159FF&color=fff',
  },
  {
    id: '3',
    name: 'Accounts User',
    email: 'accounts@haca.academy',
    role: UserRole.ACCOUNTS_TEAM,
    avatar: 'https://ui-avatars.com/api/?name=Accounts+User&background=0159FF&color=fff',
  },
  {
    id: '4',
    name: 'Growth User',
    email: 'growth@haca.academy',
    role: UserRole.GROWTH_TEAM,
    avatar: 'https://ui-avatars.com/api/?name=Growth+User&background=0159FF&color=fff',
  },
  {
    id: '5',
    name: 'Team Lead',
    email: 'team@haca.academy',
    role: UserRole.TEAM_LEAD,
    avatar: 'https://ui-avatars.com/api/?name=Team+Lead&background=0159FF&color=fff',
  },
  {
    id: '6',
    name: 'Project Lead',
    email: 'project@haca.academy',
    role: UserRole.PROJECT_LEAD,
    department: SchoolDepartment.CODING,
    avatar: 'https://ui-avatars.com/api/?name=Project+Lead&background=0159FF&color=fff',
  },
];

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
    // In a real app, you would make an API call to verify credentials
    // For this demo, we'll just check against our mock users
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // In real app, verify password hash here
    if (password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    localStorage.setItem('haca_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
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
