
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out p-8",
          collapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  ) : null;
};

export default DashboardLayout;
