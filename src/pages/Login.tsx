
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { Layers } from 'lucide-react';

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
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
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-700 opacity-90"></div>
        <div className="relative z-10 text-white max-w-lg p-12 animate-fade-in">
          <div className="flex items-center mb-8">
            <Layers className="h-10 w-10 mr-3" />
            <h1 className="text-3xl font-bold">HACA Academy</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">Welcome to your Dashboard</h2>
          <p className="text-lg opacity-90 mb-8">
            Access your role-specific dashboard to track performance metrics and manage your academic programs.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Role-Based Access</h3>
              <p className="text-sm opacity-80">Customized dashboards for each role in the academy.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-sm opacity-80">Monitor performance metrics with live data updates.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">School Management</h3>
              <p className="text-sm opacity-80">Dedicated views for each school department.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Secure Platform</h3>
              <p className="text-sm opacity-80">Enterprise-grade security for your sensitive data.</p>
            </div>
          </div>
        </div>
        
        {/* Abstract shapes in background */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mt-48 -mr-48"></div>
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="md:hidden flex items-center justify-center mb-6">
              <Layers className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold">HACA Academy</h1>
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to Dashboard</h2>
            <p className="text-gray-500">Enter your credentials to access your dashboard</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
